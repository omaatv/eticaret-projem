<?php
// index.php – ARISPORT API router

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

// ---------------- SESSION AYARLARI ----------------

session_set_cookie_params([
    'lifetime' => 60 * 60 * 24 * 7, // 1 hafta
    'path'     => '/',
    'secure'   => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
    'httponly' => true,
    'samesite' => 'Lax',
]);

session_start();

// ---------------- CORS ----------------
header('Access-Control-Allow-Origin: ' . FRONTEND_ORIGIN);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---------------- YARDIMCI FONKSİYONLAR ----------------

function get_json_body(): array
{
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/**
 * Session’daki kullanıcıyı DB’den çeker.
 */
function current_user(): ?array
{
    if (empty($_SESSION['user_id'])) {
        return null;
    }

    $pdo = db();
    $stmt = $pdo->prepare("SELECT id, name, email, role, created_at FROM users WHERE id = :id LIMIT 1");
    $stmt->execute(['id' => (int)$_SESSION['user_id']]);
    $user = $stmt->fetch();

    return $user ?: null;
}

/**
 * Sadece admin erişimi için kontrol.
 */
function require_admin(): void
{
    $user = current_user();
    if (!$user || ($user['role'] ?? 'user') !== 'admin') {
        json_response(['error' => 'forbidden', 'message' => 'Admin erişimi gerekli'], 403);
    }
}

// ---------------- ROUTER ----------------

$uriPath  = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path     = trim($uriPath, '/');
$segments = $path === '' ? [] : explode('/', $path);

// /api/... prefix’ini at
if (!empty($segments) && $segments[0] === 'api') {
    array_shift($segments);
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    // -------- HEALTH --------
    if ($method === 'GET' && count($segments) === 1 && $segments[0] === 'health') {
        handle_health();
    }

    // -------- PRODUCTS --------
    if ($method === 'GET' && count($segments) === 1 && $segments[0] === 'products') {
        handle_products_list();
    }

    if ($method === 'GET' && count($segments) === 2 && $segments[0] === 'products') {
        handle_product_detail((int)$segments[1]);
    }

    // -------- AUTH --------
    if ($method === 'POST' && count($segments) === 2 && $segments[0] === 'auth' && $segments[1] === 'register') {
        handle_auth_register();
    }

    if ($method === 'POST' && count($segments) === 2 && $segments[0] === 'auth' && $segments[1] === 'login') {
        handle_auth_login();
    }

    if ($method === 'POST' && count($segments) === 2 && $segments[0] === 'auth' && $segments[1] === 'logout') {
        handle_auth_logout();
    }

    if ($method === 'GET' && count($segments) === 2 && $segments[0] === 'auth' && $segments[1] === 'me') {
        handle_auth_me();
    }

    // Buraya ileride admin endpointleri ( /api/admin/... ) ekleyeceğiz.

    // Hiçbiri eşleşmezse:
    json_response([
        'error'   => 'not_found',
        'message' => 'Endpoint not found',
    ], 404);

} catch (Throwable $e) {
    json_response([
        'error'   => 'server_error',
        'message' => $e->getMessage(),
    ], 500);
}

// ---------------- HANDLERLAR ----------------

function handle_health(): void
{
    json_response([
        'status' => 'ok',
        'time'   => date('c'),
    ]);
}

function handle_products_list(): void
{
    $pdo = db();

    $stmt = $pdo->query("
        SELECT *
        FROM products
        ORDER BY id DESC
        LIMIT 100
    ");

    $items = $stmt->fetchAll();

    json_response([
        'items' => $items,
        'count' => count($items),
    ]);
}

function handle_product_detail(int $id): void
{
    if ($id <= 0) {
        json_response(['error' => 'invalid_id'], 400);
    }

    $pdo = db();
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = :id LIMIT 1");
    $stmt->execute(['id' => $id]);
    $product = $stmt->fetch();

    if (!$product) {
        json_response(['error' => 'product_not_found'], 404);
    }

    json_response($product);
}

// ------------- AUTH HANDLERLARI -------------

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 */
function handle_auth_register(): void
{
    $body = get_json_body();

    $name     = trim($body['name']    ?? '');
    $email    = trim($body['email']   ?? '');
    $password = (string)($body['password'] ?? '');

    if ($name === '' || $email === '' || $password === '') {
        json_response(['error' => 'validation_error', 'message' => 'İsim, e-posta ve şifre zorunludur.'], 422);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_response(['error' => 'validation_error', 'message' => 'Geçerli bir e-posta girin.'], 422);
    }

    if (strlen($password) < 6) {
        json_response(['error' => 'validation_error', 'message' => 'Şifre en az 6 karakter olmalı.'], 422);
    }

    $pdo = db();

    // E-posta kullanımda mı?
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
    $stmt->execute(['email' => $email]);
    if ($stmt->fetch()) {
        json_response(['error' => 'email_in_use', 'message' => 'Bu e-posta zaten kayıtlı.'], 409);
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("
        INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
        VALUES (:name, :email, :password_hash, 'user', NOW(), NOW())
    ");
    $stmt->execute([
        'name'          => $name,
        'email'         => $email,
        'password_hash' => $hash,
    ]);

    $userId = (int)$pdo->lastInsertId();

    $_SESSION['user_id'] = $userId;
    $_SESSION['role']    = 'user';

    json_response([
        'id'    => $userId,
        'name'  => $name,
        'email' => $email,
        'role'  => 'user',
    ], 201);
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
function handle_auth_login(): void
{
    $body = get_json_body();

    $email    = trim($body['email']   ?? '');
    $password = (string)($body['password'] ?? '');

    if ($email === '' || $password === '') {
        json_response(['error' => 'validation_error', 'message' => 'E-posta ve şifre zorunludur.'], 422);
    }

    $pdo = db();

    $stmt = $pdo->prepare("
        SELECT id, name, email, password_hash, role, created_at
        FROM users
        WHERE email = :email
        LIMIT 1
    ");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        json_response(['error' => 'invalid_credentials', 'message' => 'E-posta veya şifre hatalı.'], 401);
    }

    $_SESSION['user_id'] = (int)$user['id'];
    $_SESSION['role']    = $user['role'];

    unset($user['password_hash']);

    json_response(['user' => $user]);
}

/**
 * POST /api/auth/logout
 */
function handle_auth_logout(): void
{
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 3600,
            $params['path'] ?? '/',
            $params['domain'] ?? '',
            $params['secure'] ?? false,
            $params['httponly'] ?? true
        );
    }
    session_destroy();

    json_response(['status' => 'logged_out']);
}

/**
 * GET /api/auth/me
 */
function handle_auth_me(): void
{
    $user = current_user();
    if (!$user) {
        json_response(['error' => 'unauthenticated'], 401);
    }

    json_response(['user' => $user]);
}
