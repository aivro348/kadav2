<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$counter_file = '../visitor_count.txt';

// Read current count
if (file_exists($counter_file)) {
    $count = (int)file_get_contents($counter_file);
} else {
    $count = 0;
}

// Increment count
$count++;

// Save new count
file_put_contents($counter_file, (string)$count);

// Return JSON
header('Content-Type: application/json');
echo json_encode(['visitors' => $count]);
?>
