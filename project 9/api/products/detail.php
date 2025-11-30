<?php
// Public product detail endpoint

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';

function send_json(array $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    send_json(['success' => false, 'error' => 'Geçersiz ürün ID'], 400);
}

try {
    $pdo = get_pdo();
    $stmt = $pdo->prepare("
        SELECT
            id,
            name,
            slug,
            description,
            price,
            stock,
            main_image,
            is_featured,
            is_new,
            created_at,
            updated_at
        FROM products
        WHERE id = :id
        LIMIT 1
    ");
    $stmt->execute(['id' => $id]);
    $product = $stmt->fetch();

    if (!$product) {
        send_json(['success' => false, 'error' => 'Ürün bulunamadı'], 404);
    }

    send_json([
        'success' => true,
        'product' => $product,
    ]);
} catch (Throwable $e) {
    send_json([
        'success' => false,
        'error'   => 'Sunucu hatası: ' . $e->getMessage(),
    ], 500);
}
