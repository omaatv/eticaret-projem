<?php
// Admin: delete a product

require_once __DIR__ . '/../../auth/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'error' => 'Method not allowed'], 405);
}

require_admin_key();

$body = get_json_body();
$id   = isset($body['id']) ? (int)$body['id'] : 0;

if ($id <= 0 && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
}

if ($id <= 0) {
    send_json(['success' => false, 'error' => 'Geçersiz ürün ID'], 400);
}

try {
    $pdo = get_pdo();
    $stmt = $pdo->prepare("DELETE FROM products WHERE id = :id");
    $stmt->execute(['id' => $id]);

    if ($stmt->rowCount() === 0) {
        send_json(['success' => false, 'error' => 'Ürün bulunamadı'], 404);
    }

    send_json(['success' => true]);
} catch (Throwable $e) {
    send_json([
        'success' => false,
        'error'   => 'Sunucu hatası: ' . $e->getMessage(),
    ], 500);
}
