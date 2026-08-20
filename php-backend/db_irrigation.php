<?php
// Enable CORS for frontend requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost'; // Usually localhost on Hostinger
$type = isset($_GET['type']) ? $_GET['type'] : '';

if ($_SERVER['SERVER_NAME'] === 'localhost' || $_SERVER['SERVER_NAME'] === '127.0.0.1') {
    // Local development credentials
    $dbname = 'rws_borewell';
    $username = 'root';
    $password = '';
} else {
    // Hostinger production credentials
    if ($type === 'hnss' || $type === 'palar') {
        $dbname = 'u110415653_Charan';
        $username = 'u110415653_charan';
        $password = 'Charan@18042004'; 
    } else {
        $dbname = 'u110415653_Charan'; 
        $username = 'u110415653_charan'; 
        $password = 'Charan@18042004'; 
    }
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    // Set PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed for $type: " . $e->getMessage()]);
    exit();
}
?>
