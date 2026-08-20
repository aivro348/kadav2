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
require_once '../jwt.php';

// This will block requests without a valid Bearer token
$userPayload = JWT::authenticate();
$username = $userPayload['username'];
$role = $userPayload['role'];

$method = $_SERVER['REQUEST_METHOD'];
$type = isset($_GET['type']) ? $_GET['type'] : '';

if ($type !== 'hnss' && $type !== 'palar') {
    echo json_encode(["error" => "Invalid survey type"]);
    exit;
}

$mainTable = $type === 'hnss' ? 'survey_hnss' : 'survey_palar';
$pointsTable = $type === 'hnss' ? 'survey_hnss_points' : 'survey_palar_points';

// Helper function to save base64 image to file
function saveBase64Image($base64String, $prefix, $uploadDir, $surveyFolder) {
    if (!$base64String) return null;
    $parts = explode(',', $base64String);
    if (count($parts) !== 2) return null;
    $data = base64_decode($parts[1]);
    if ($data === false) return null;
    
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    $fileName = $prefix . '_' . uniqid() . '.jpg';
    $filePath = $uploadDir . $fileName;
    if (file_put_contents($filePath, $data)) {
        return $surveyFolder . '/' . $fileName;
    }
    return null;
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data) {
        echo json_encode(["error" => "Invalid JSON input"]);
        exit;
    }

    try {
        $pdo->beginTransaction();

        // 1. Insert main survey record first to obtain survey ID
        $stmt = $pdo->prepare("INSERT INTO $mainTable (surveyor_id, village, mandal, panchayat, total_length, total_width, gps_lat, gps_lng, gps_accuracy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->execute([
            $data['surveyor_id'] ?? null,
            $data['village'] ?? null,
            $data['mandal'] ?? null,
            $data['panchayat'] ?? null,
            $data['total_length'] ?? null,
            $data['total_width'] ?? null,
            $data['gps_lat'] ?? null,
            $data['gps_lng'] ?? null,
            $data['gps_accuracy'] ?? null
        ]);
        
        $survey_id = $pdo->lastInsertId();

        // 2. Create dedicated folder per survey (e.g. uploads/hnss/survey_15/ or uploads/palar/survey_8/)
        $surveyFolder = 'survey_' . $survey_id;
        $uploadDir = '../uploads/' . $type . '/' . $surveyFolder . '/';

        $photo_east = saveBase64Image($data['photo_east'] ?? null, 'east', $uploadDir, $surveyFolder);
        $photo_west = saveBase64Image($data['photo_west'] ?? null, 'west', $uploadDir, $surveyFolder);
        $photo_north = saveBase64Image($data['photo_north'] ?? null, 'north', $uploadDir, $surveyFolder);
        $photo_south = saveBase64Image($data['photo_south'] ?? null, 'south', $uploadDir, $surveyFolder);

        // 3. Update main survey record with photo file paths
        $updateStmt = $pdo->prepare("UPDATE $mainTable SET photo_east = ?, photo_west = ?, photo_north = ?, photo_south = ? WHERE id = ?");
        $updateStmt->execute([$photo_east, $photo_west, $photo_north, $photo_south, $survey_id]);

        if (isset($data['points']) && is_array($data['points'])) {
            $ptStmt = $pdo->prepare("INSERT INTO $pointsTable (survey_id, point_number, latitude, longitude, point_value, photo) VALUES (?, ?, ?, ?, ?, ?)");
            foreach ($data['points'] as $index => $point) {
                $ptPhoto = saveBase64Image($point['photo'] ?? null, 'point' . ($index + 1), $uploadDir, $surveyFolder);
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
        error_log("Failed to save irrigation survey: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => "Failed to save survey due to an internal server error."]);
    }
} elseif ($method === 'GET') {
    try {
        if ($role === 'admin') {
            $stmt = $pdo->query("SELECT * FROM $mainTable ORDER BY created_at DESC LIMIT 100");
        } else {
            $stmt = $pdo->prepare("SELECT * FROM $mainTable WHERE surveyor_id = ? ORDER BY created_at DESC LIMIT 100");
            $stmt->execute([$username]);
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
        error_log("Failed to fetch irrigation surveys: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch surveys due to an internal server error."]);
    }
} elseif ($method === 'DELETE') {
    // Only admins can delete
    if ($role !== 'admin') {
        http_response_code(403);
        echo json_encode(["error" => "Only administrators can delete surveys"]);
        exit;
    }

    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if (!$id) {
        echo json_encode(["error" => "Survey ID is required for deletion"]);
        exit;
    }

    try {
        // Fetch survey record to get uploaded photo filenames for file cleanup
        $stmt = $pdo->prepare("SELECT photo_east, photo_west, photo_north, photo_south FROM $mainTable WHERE id = ?");
        $stmt->execute([$id]);
        $survey = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($survey) {
            $uploadDir = '../uploads/' . $type . '/';
            $photos = ['photo_east', 'photo_west', 'photo_north', 'photo_south'];
            foreach ($photos as $p) {
                if (!empty($survey[$p])) {
                    $filePath = $uploadDir . $survey[$p];
                    if (file_exists($filePath)) {
                        @unlink($filePath);
                    }
                }
            }
            // Remove per-survey dedicated folder if empty
            $surveyFolder = $uploadDir . 'survey_' . $id;
            if (file_exists($surveyFolder) && is_dir($surveyFolder)) {
                @rmdir($surveyFolder);
            }
        }

        // Delete main record from MySQL phpMyAdmin database (points cascade automatically)
        $delStmt = $pdo->prepare("DELETE FROM $mainTable WHERE id = ?");
        $delStmt->execute([$id]);

        echo json_encode(["success" => true, "message" => "Survey deleted successfully from phpMyAdmin database"]);
    } catch (Exception $e) {
        error_log("Failed to delete irrigation survey: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete survey due to an internal server error."]);
    }
}
?>
