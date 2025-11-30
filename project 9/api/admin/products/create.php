<?php
// Admin: create a new product

require_once __DIR__ . '/../../auth/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'error' => 'Method not allowed'], 405);
}

require_admin_key();

$body = get_json_body();

$name        = trim((string)($body['name'] ?? ''));
$slug        = trim((string)($body['slug'] ?? ''));
$description = trim((string)($body['description'] ?? ''));
$price       = $body['price'] ?? null;
$stock       = $body['stock'] ?? null;
$mainImage   = trim((string)($body['main_image'] ?? ''));
$isFeatured  = (int)($body['is_featured'] ?? 0);
$isNew       = (int)($body['is_new'] ?? 0);
$categoryId  = $body['category_id'] ?? null;

if ($name === '' || $slug === '' || $price === null || $stock === null) {
    send_json(['success' => false, 'error' => 'name, slug, price ve stock zorunludur'], 400);
}

if (!is_numeric($price) || !is_numeric($stock)) {
    send_json(['success' => false, 'error' => 'price ve stock sayısal olmalıdır'], 400);
}

$isFeatured = $isFeatured ? 1 : 0;
$isNew      = $isNew ? 1 : 0;
$price      = (float)$price;
$stock      = (int)$stock;
$categoryId = ($categoryId === '' || $categoryId === null) ? null : (int)$categoryId;
$mainImage  = $mainImage !== '' ? $mainImage : null;

try {
    $pdo = get_pdo();
    $stmt = $pdo->prepare("
        INSERT INTO products
            (name, slug, description, price, stock, main_image, is_featured, is_new, category_id, created_at, updated_at)
        VALUES
            (:name, :slug, :description, :price, :stock, :main_image, :is_featured, :is_new, :category_id, NOW(), NOW())
    ");

    $stmt->execute([
        'name'        => $name,
        'slug'        => $slug,
        'description' => $description,
        'price'       => $price,
        'stock'       => $stock,
        'main_image'  => $mainImage,
        'is_featured' => $isFeatured,
        'is_new'      => $isNew,
        'category_id' => $categoryId,
    ]);

    $productId = (int)$pdo->lastInsertId();

    $fetch = $pdo->prepare("
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
        WHERE id = :id
        LIMIT 1
    ");
    $fetch->execute(['id' => $productId]);
    $product = $fetch->fetch();

    send_json([
        'success' => true,
        'product' => $product,
    ], 201);
} catch (Throwable $e) {
    send_json([
        'success' => false,
        'error'   => 'Sunucu hatası: ' . $e->getMessage(),
    ], 500);
}
