<?php
// Admin: list all products

require_once __DIR__ . '/../../auth/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_json(['success' => false, 'error' => 'Method not allowed'], 405);
}

require_admin_key();

try {
    $pdo = get_pdo();
    $stmt = $pdo->query("
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
            category_id,
            created_at,
            updated_at
        FROM products
        ORDER BY created_at DESC
    ");

    $products = $stmt->fetchAll();

    send_json([
        'success'  => true,
        'count'    => count($products),
        'products' => $products,
    ]);
} catch (Throwable $e) {
    send_json([
        'success' => false,
        'error'   => 'Sunucu hatası: ' . $e->getMessage(),
    ], 500);
}
