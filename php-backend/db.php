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
$dbname = 'u110415653_iitk'; // The DB name from your screenshot
$username = 'u110415653_admin'; // Correct database username
$password = 'Charan@2004!'; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    // Set PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    // Log the real error to the server's error log securely
    error_log("Database connection failed: " . $e->getMessage());
    http_response_code(500);
    // Return a generic error to the frontend to prevent SQL/Path exposure
    echo json_encode(["error" => "Database connection failed. Please contact support."]);
    exit();
}
?>
