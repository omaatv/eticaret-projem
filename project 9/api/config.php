<?php
// config.php – ARISPORT API

// --- DATABASE ---
const DB_HOST = 'localhost';
const DB_NAME = 'arisport_db';
const DB_USER = 'arisport_user';
const DB_PASS = 'Ar1sport!2024?';

// --- URL'ler ---
const FRONTEND_ORIGIN = 'https://arisport.com.tr';
const BACKEND_URL     = 'https://arisport.com.tr/api';

// === Admin API key (for /api/admin endpoints) ===
const ADMIN_API_KEY = 'ARISPORT-ADMIN-2024!'; // burayı istersen başka güçlü bir key yap

// --- PayTR (şimdilik placeholder, sonra dolduracağız) ---
const PAYTR_MERCHANT_ID   = 'PAYTR_MERCHANT_ID';
const PAYTR_MERCHANT_KEY  = 'PAYTR_MERCHANT_KEY';
const PAYTR_MERCHANT_SALT = 'PAYTR_MERCHANT_SALT';

// --- JSON response helper ---
function json_response($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
