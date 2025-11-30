<?php
// db.php – ARISPORT PDO bağlantısı

require_once __DIR__ . '/config.php';

/**
 * Tekil PDO instance döndürür.
 * Hem get_pdo() hem de db() adıyla kullanabil.
 *
 * @return PDO
 */
function get_pdo(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    // config.php'deki sabitleri kullanıyoruz
    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    } catch (PDOException $e) {
        // Hata durumunda JSON olarak cevap ver
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'error'   => 'database_connection_failed',
            'message' => $e->getMessage(),
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    return $pdo;
}

/**
 * Kısa isim sevenler için alias.
 * index.php içinde db() olarak da çağırabilirsin.
 *
 * @return PDO
 */
function db(): PDO
{
    return get_pdo();
}
