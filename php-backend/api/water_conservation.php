<?php
require_once '../db.php';
require_once '../jwt.php';

header('Content-Type: application/json');

// This will block requests without a valid Bearer token
$userPayload = JWT::authenticate();
$username = $userPayload['username'];
$role = $userPayload['role'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Receive JSON payload
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON payload"]);
        exit();
    }
    
    // Server-side mapping to catch cached React apps sending IDs (e.g. M2, P30, H170)
    require_once 'locations_map.php';
    if (isset($data['mandal']) && isset($LOCATION_MAP[$data['mandal']])) {
        $data['mandal'] = $LOCATION_MAP[$data['mandal']];
    }
    if (isset($data['panchayat']) && isset($LOCATION_MAP[$data['panchayat']])) {
        $data['panchayat'] = $LOCATION_MAP[$data['panchayat']];
    }
    if (isset($data['village']) && isset($LOCATION_MAP[$data['village']])) {
        $data['village'] = $LOCATION_MAP[$data['village']];
    }
    
    try {
        $pdo->beginTransaction();
        
        // Prepare SQL insert
        $stmt = $pdo->prepare("
            INSERT INTO water_conservation_surveys (
                mandal, panchayat, village, 
                structure_type, structure_subtype, 
                length, breadth, height, depth, capacity, capacity_unit, fillings,
                latitude, longitude, gps_accuracy, 
                created_by
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        ");
        
        // Helper function to convert empty strings to null for strict DB mode
        $val = function($key) use ($data) {
            return (isset($data[$key]) && $data[$key] !== "") ? $data[$key] : null;
        };
        
        $stmt->execute([
            $val('mandal'),
            $val('panchayat'),
            $val('village'),
            $val('structureType'),
            $val('structureSubtype'),
            $val('length'),
            $val('breadth'),
            $val('height'),
            $val('depth'),
            $val('capacity'),
            $val('capacityUnit'),
            $val('fillings'),
            $val('latitude'),
            $val('longitude'),
            $val('gps_accuracy'),
            $val('created_by')
        ]);
        
        $survey_id = $pdo->lastInsertId();
        
        // Process images
        if (isset($data['images']) && is_array($data['images'])) {
            $imgStmt = $pdo->prepare("INSERT INTO water_conservation_images (survey_id, file_path) VALUES (?, ?)");
            
            // Create dedicated per-survey folder under water_conservation sector
            $surveyFolder = 'survey_' . $survey_id;
            $uploadDir = '../uploads/water_conservation/' . $surveyFolder . '/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            
            foreach ($data['images'] as $index => $base64) {
                // Determine extension and decode safely
                $ext = 'jpg';
                if (strpos($base64, ',') !== false) {
                    list($header, $encoded) = explode(',', $base64);
                    if (preg_match('/data:image\/(.*?);/', $header, $matches)) {
                        $parsedExt = strtolower($matches[1]);
                        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'heic'];
                        if (in_array($parsedExt, $allowed)) {
                            $ext = $parsedExt;
                        }
                    }
                } else {
                    $encoded = $base64;
                }
                
                $imgData = base64_decode($encoded);
                if ($imgData !== false) {
                    $filename = 'image_' . ($index + 1) . '_' . uniqid() . '.' . $ext;
                    $filepath = $uploadDir . $filename;
                    
                    if (file_put_contents($filepath, $imgData)) {
                        $imgStmt->execute([$survey_id, 'uploads/water_conservation/' . $surveyFolder . '/' . $filename]);
                    }
                }
            }
        }
        
        $pdo->commit();
        echo json_encode(["success" => true, "survey_id" => $survey_id]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        error_log("Failed to save water conservation survey: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => "Failed to save water conservation survey due to an internal server error."]);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        if (isset($_GET['id'])) {
            // Fetch single survey with images
            $id = $_GET['id'];
            $stmt = $pdo->prepare("SELECT * FROM water_conservation_surveys WHERE survey_id = ?");
            $stmt->execute([$id]);
            $survey = $stmt->fetch();
            
            if ($survey) {
                $imgStmt = $pdo->prepare("SELECT file_path FROM water_conservation_images WHERE survey_id = ?");
                $imgStmt->execute([$id]);
                $survey['images'] = $imgStmt->fetchAll(PDO::FETCH_COLUMN);
                echo json_encode($survey);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Survey not found"]);
            }
        } else {
            // Basic GET to fetch all surveys
            // Use authenticated user role/username instead of query parameter
            if ($role === 'admin') {
                $stmt = $pdo->query("SELECT * FROM water_conservation_surveys ORDER BY created_at DESC LIMIT 100");
            } else {
                // If not admin, only show their own surveys
                $stmt = $pdo->prepare("SELECT * FROM water_conservation_surveys WHERE created_by = ? ORDER BY created_at DESC LIMIT 100");
                $stmt->execute([$username]);
            }
            
            $surveys = $stmt->fetchAll();
            echo json_encode($surveys);
        }
    } catch (Exception $e) {
        error_log("Failed to fetch surveys: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch surveys due to an internal server error."]);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
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
        // Fetch survey_images to clean up physical image upload files
        $imgStmt = $pdo->prepare("SELECT file_path FROM water_conservation_images WHERE survey_id = ?");
        $imgStmt->execute([$id]);
        $images = $imgStmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($images as $img) {
            $filePath = '../' . $img['file_path'];
            if (file_exists($filePath)) {
                @unlink($filePath);
            }
        }

        // Delete survey folder if empty
        $surveyFolder = '../uploads/water_conservation/survey_' . $id;
        if (file_exists($surveyFolder) && is_dir($surveyFolder)) {
            @rmdir($surveyFolder);
        }

        // Delete survey from main table in MySQL database
        $delStmt = $pdo->prepare("DELETE FROM water_conservation_surveys WHERE survey_id = ?");
        $delStmt->execute([$id]);

        // Clean up survey_images records
        $delImgStmt = $pdo->prepare("DELETE FROM water_conservation_images WHERE survey_id = ?");
        $delImgStmt->execute([$id]);

        echo json_encode(["success" => true, "message" => "Water Conservation survey deleted successfully"]);
    } catch (Exception $e) {
        error_log("Failed to delete survey: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete survey due to an internal server error."]);
    }
}
?>
