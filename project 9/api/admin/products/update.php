<?php
// Admin: update an existing product

require_once __DIR__ . '/../../auth/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'error' => 'Method not allowed'], 405);
}

require_admin_key();

$body = get_json_body();
$id   = isset($body['id']) ? (int)$body['id'] : 0;

if ($id <= 0) {
    send_json(['success' => false, 'error' => 'Geçersiz ürün ID'], 400);
}

$fields = [];
$params = ['id' => $id];

if (array_key_exists('name', $body)) {
    $fields[]        = 'name = :name';
    $params['name']  = trim((string)$body['name']);
}

if (array_key_exists('slug', $body)) {
    $fields[]        = 'slug = :slug';
    $params['slug']  = trim((string)$body['slug']);
}

if (array_key_exists('description', $body)) {
    $fields[]             = 'description = :description';
    $params['description'] = trim((string)$body['description']);
}

if (array_key_exists('price', $body)) {
    if (!is_numeric($body['price'])) {
        send_json(['success' => false, 'error' => 'price sayısal olmalıdır'], 400);
    }
    $fields[]        = 'price = :price';
    $params['price'] = (float)$body['price'];
}

if (array_key_exists('stock', $body)) {
    if (!is_numeric($body['stock'])) {
        send_json(['success' => false, 'error' => 'stock sayısal olmalıdır'], 400);
    }
    $fields[]        = 'stock = :stock';
    $params['stock'] = (int)$body['stock'];
}

if (array_key_exists('main_image', $body)) {
    $fields[]            = 'main_image = :main_image';
    $params['main_image'] = trim((string)$body['main_image']) !== '' ? trim((string)$body['main_image']) : null;
}

if (array_key_exists('is_featured', $body)) {
    $fields[]             = 'is_featured = :is_featured';
    $params['is_featured'] = $body['is_featured'] ? 1 : 0;
}

if (array_key_exists('is_new', $body)) {
    $fields[]        = 'is_new = :is_new';
    $params['is_new'] = $body['is_new'] ? 1 : 0;
}

if (array_key_exists('category_id', $body)) {
    $fields[]                = 'category_id = :category_id';
    $categoryVal             = $body['category_id'];
    if ($categoryVal === '' || $categoryVal === null) {
        $params['category_id'] = null;
    } elseif (!is_numeric($categoryVal)) {
        send_json(['success' => false, 'error' => 'category_id sayısal olmalıdır'], 400);
    } else {
        $params['category_id'] = (int)$categoryVal;
    }
}

if (empty($fields)) {
    send_json(['success' => false, 'error' => 'Güncellenecek alan bulunamadı'], 400);
}

try {
    $pdo = get_pdo();

    $exists = $pdo->prepare("SELECT id FROM products WHERE id = :id LIMIT 1");
    $exists->execute(['id' => $id]);
    if (!$exists->fetch()) {
        send_json(['success' => false, 'error' => 'Ürün bulunamadı'], 404);
    }

    $fields[] = 'updated_at = NOW()';
    $sql = 'UPDATE products SET ' . implode(', ', $fields) . ' WHERE id = :id';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

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
    $fetch->execute(['id' => $id]);
    $product = $fetch->fetch();

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
