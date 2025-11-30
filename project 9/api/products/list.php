<?php
// api/products/list.php
// Ürün listesini dönen public endpoint

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
// İstersen sonra domain bazlı sıkılaştırırız
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../db.php';

try {
    $pdo = get_pdo();

    // --- Basit pagination ---
    $page     = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $perPage  = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 20;

    if ($page < 1) {
        $page = 1;
    }
    if ($perPage < 1) {
        $perPage = 20;
    }
    if ($perPage > 100) {
        $perPage = 100;
    }

    $offset = ($page - 1) * $perPage;

    // NOT: Şu an en güvenlisi *tüm kolonları* çekmek.
    // İleride products kolonlarını netleştirince SELECT kısmını daraltırız.
    $stmt = $pdo->prepare("
        SELECT *
        FROM products
        ORDER BY id DESC
        LIMIT :limit OFFSET :offset
    ");

    $stmt->bindValue(':limit',  $perPage, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset,  PDO::PARAM_INT);
    $stmt->execute();

    $products = $stmt->fetchAll();

    echo json_encode([
        'ok'       => true,
        'page'     => $page,
        'per_page' => $perPage,
        'count'    => count($products),
        'items'    => $products,
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok'      => false,
        'error'   => 'server_error',
        'message' => $e->getMessage(), // canlıda istersen gizleriz
    ], JSON_UNESCAPED_UNICODE);
}
