<?php
// ARISPORT – PDO DB TEST

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<pre>ARISPORT PDO DB TEST\n\n";

$host = 'localhost';
$db   = 'arisport_db';
$user = 'arisport_user';            // 👈 tek alt çizgi
$pass = 'Ar1sport!2024?';  // Yoncu’da GÜNCELLE dediğin şifre

$dsn = "mysql:host={$host};dbname={$db};charset=utf8mb4";

try {
    echo "Trying to connect...\n\n";

    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    echo "✅ Connection SUCCESS!\n\n";

    $version = $pdo->query('SELECT VERSION() AS v')->fetchColumn();
    echo "MySQL version: {$version}\n\n";

    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo "Tables:\n";
    foreach ($tables as $t) {
        echo " - {$t}\n";
    }

    echo "\nTEST FINISHED\n";

} catch (PDOException $e) {
    echo "❌ Connection FAILED:\n";
    echo $e->getMessage() . "\n";
}
