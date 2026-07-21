<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];
$type = isset($_GET['type']) ? $_GET['type'] : '';

if ($type !== 'hnss' && $type !== 'palar') {
    echo json_encode(["error" => "Invalid survey type"]);
    exit;
}

$mainTable = $type === 'hnss' ? 'survey_hnss' : 'survey_palar';
$pointsTable = $type === 'hnss' ? 'survey_hnss_points' : 'survey_palar_points';

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data) {
        echo json_encode(["error" => "Invalid JSON input"]);
        exit;
    }
    
    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("INSERT INTO $mainTable (surveyor_id, village, mandal, panchayat, total_length, total_width, gps_lat, gps_lng, gps_accuracy, photo_east, photo_west, photo_north, photo_south) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->execute([
            $data['surveyor_id'] ?? null,
            $data['village'] ?? null,
            $data['mandal'] ?? null,
            $data['panchayat'] ?? null,
            $data['total_length'] ?? null,
            $data['total_width'] ?? null,
            $data['gps_lat'] ?? null,
            $data['gps_lng'] ?? null,
            $data['gps_accuracy'] ?? null,
            $data['photo_east'] ?? null,
            $data['photo_west'] ?? null,
            $data['photo_north'] ?? null,
            $data['photo_south'] ?? null
        ]);
        
        $survey_id = $pdo->lastInsertId();

        if (isset($data['points']) && is_array($data['points'])) {
            $ptStmt = $pdo->prepare("INSERT INTO $pointsTable (survey_id, point_number, latitude, longitude, point_value, photo) VALUES (?, ?, ?, ?, ?, ?)");
            foreach ($data['points'] as $index => $point) {
                $ptStmt->execute([
                    $survey_id,
                    $index + 1,
                    $point['latitude'] ?? null,
                    $point['longitude'] ?? null,
                    $point['point_value'] ?? null,
                    $point['photo'] ?? null
                ]);
            }
        }
        
        $pdo->commit();
        echo json_encode(["success" => true, "id" => $survey_id]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(["error" => $e->getMessage()]);
    }
} elseif ($method === 'GET') {
    $user = isset($_GET['user']) ? $_GET['user'] : '';
    
    try {
        if ($user === 'admin') {
            $stmt = $pdo->query("SELECT * FROM $mainTable ORDER BY created_at DESC LIMIT 100");
        } else {
            $stmt = $pdo->prepare("SELECT * FROM $mainTable WHERE surveyor_id = ? ORDER BY created_at DESC LIMIT 100");
            $stmt->execute([$user]);
        }
        
        $surveys = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Optionally fetch points for a specific survey if survey_id is provided
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            $ptStmt = $pdo->prepare("SELECT * FROM $pointsTable WHERE survey_id = ? ORDER BY point_number ASC");
            $ptStmt->execute([$id]);
            $points = $ptStmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["survey" => $surveys[0] ?? null, "points" => $points]);
            exit;
        }

        echo json_encode($surveys);
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>
