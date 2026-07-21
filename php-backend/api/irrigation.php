<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../db_irrigation.php';

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
    
    // Helper function to save base64 image to file
    function saveBase64Image($base64String, $prefix, $surveyType) {
        if (!$base64String) return null;
        $uploadDir = '../uploads/' . $surveyType . '/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $parts = explode(',', $base64String);
        if (count($parts) !== 2) return null;
        $data = base64_decode($parts[1]);
        if ($data === false) return null;
        $fileName = $prefix . '_' . uniqid() . '.jpg';
        $filePath = $uploadDir . $fileName;
        if (file_put_contents($filePath, $data)) {
            return $fileName;
        }
        return null;
    }

    try {
        $pdo->beginTransaction();

        $photo_east = saveBase64Image($data['photo_east'] ?? null, 'east', $type);
        $photo_west = saveBase64Image($data['photo_west'] ?? null, 'west', $type);
        $photo_north = saveBase64Image($data['photo_north'] ?? null, 'north', $type);
        $photo_south = saveBase64Image($data['photo_south'] ?? null, 'south', $type);

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
            $photo_east,
            $photo_west,
            $photo_north,
            $photo_south
        ]);
        
        $survey_id = $pdo->lastInsertId();

        if (isset($data['points']) && is_array($data['points'])) {
            $ptStmt = $pdo->prepare("INSERT INTO $pointsTable (survey_id, point_number, latitude, longitude, point_value, photo) VALUES (?, ?, ?, ?, ?, ?)");
            foreach ($data['points'] as $index => $point) {
                // Points don't have photos anymore, but just in case
                $ptPhoto = saveBase64Image($point['photo'] ?? null, 'point' . ($index + 1), $type);
                $ptStmt->execute([
                    $survey_id,
                    $index + 1,
                    $point['latitude'] ?? null,
                    $point['longitude'] ?? null,
                    $point['point_value'] ?? null,
                    $ptPhoto
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
