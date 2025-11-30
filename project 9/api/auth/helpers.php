<?php

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';

if (!function_exists('send_json')) {
    function send_json(array $data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }
}

if (!function_exists('get_json_body')) {
    function get_json_body(): array
    {
        $raw = file_get_contents('php://input');
        if ($raw === false || $raw === '') {
            return [];
        }

        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }
}

if (!function_exists('require_admin_key')) {
    function require_admin_key(): void
    {
        $provided = $_SERVER['HTTP_X_ADMIN_KEY'] ?? '';

        $expected = defined('ADMIN_API_KEY')
            ? ADMIN_API_KEY
            : (getenv('ADMIN_API_KEY') !== false ? getenv('ADMIN_API_KEY') : 'change_me_admin_key');

        if ($provided === '' || $provided !== $expected) {
            send_json([
                'success' => false,
                'error'   => 'Unauthorized. Valid X-ADMIN-KEY header required.',
            ], 401);
        }
    }
}
