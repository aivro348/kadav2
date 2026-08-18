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

if ($type === 'hnss') {
    // HNSS Database Credentials
    $dbname = 'u110415653_hnss';
    $username = 'u110415653_hnss';
    $password = 'Charan@2004!'; 
} else if ($type === 'palar') {
    // Palar Database Credentials
    $dbname = 'u110415653_palar';
    $username = 'u110415653_palar';
    $password = 'Charan@2004!'; 
} else {
    // Default fallback to Borewell Database
    $dbname = 'u110415653_iitk'; 
    $username = 'u110415653_admin'; 
    $password = 'Charan@2004!'; 
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
