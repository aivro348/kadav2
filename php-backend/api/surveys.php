<?php
require_once '../db.php';

header('Content-Type: application/json');

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
            INSERT INTO surveys (
                mandal, panchayat, village, latitude, longitude, 
                status, borewell_type, supply_nature, 
                borewell_depth, motor_capacity, motor_depth, 
                delivery_pipe, water_level_fixing, water_struck_depth,
                tds, ph, hardness, drilled_year, dried_year, dried_months,
                crop_category, crop_names, dependent_families, dependent_animals, agri_land_area, created_by
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
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
            $val('latitude'),
            $val('longitude'),
            $val('status'),
            $val('borewell_type'),
            $val('supply_nature'),
            $val('borewell_depth'),
            $val('motor_capacity'),
            $val('motor_depth'),
            $val('delivery_pipe'),
            $val('water_level_fixing'),
            $val('water_struck_depth'),
            $val('tds'),
            $val('ph'),
            $val('hardness'),
            $val('drilled_year'),
            $val('dried_year'),
            $val('dried_months'),
            $val('crop_category'),
            $val('crop_names'),
            $val('dependent_families'),
            $val('dependent_animals'),
            $val('agri_land_area'),
            $data['created_by'] // Now a string directly from frontend
        ]);
        
        $survey_id = $pdo->lastInsertId();
        
        // Process images
        if (isset($data['images']) && is_array($data['images'])) {
            $imgStmt = $pdo->prepare("INSERT INTO survey_images (survey_id, file_path) VALUES (?, ?)");
            
            // Create dedicated per-survey folder under borewell sector
            $surveyFolder = 'survey_' . $survey_id;
            $uploadDir = '../uploads/borewell/' . $surveyFolder . '/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            
            foreach ($data['images'] as $index => $base64) {
                // Determine extension and decode
                $ext = 'jpg';
                if (strpos($base64, ',') !== false) {
                    list($header, $encoded) = explode(',', $base64);
                    if (preg_match('/data:image\/(.*?);/', $header, $matches)) {
                        $ext = $matches[1];
                    }
                } else {
                    $encoded = $base64;
                }
                
                $imgData = base64_decode($encoded);
                if ($imgData !== false) {
                    $filename = 'image_' . ($index + 1) . '_' . uniqid() . '.' . $ext;
                    $filepath = $uploadDir . $filename;
                    
                    if (file_put_contents($filepath, $imgData)) {
                        $imgStmt->execute([$survey_id, 'uploads/borewell/' . $surveyFolder . '/' . $filename]);
                    }
                }
            }
        }
        
        $pdo->commit();
        echo json_encode(["success" => true, "survey_id" => $survey_id]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(["error" => "Failed to save survey: " . $e->getMessage()]);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        if (isset($_GET['id'])) {
            // Fetch single survey with images
            $id = $_GET['id'];
            $stmt = $pdo->prepare("SELECT * FROM surveys WHERE survey_id = ?");
            $stmt->execute([$id]);
            $survey = $stmt->fetch();
            
            if ($survey) {
                $imgStmt = $pdo->prepare("SELECT file_path FROM survey_images WHERE survey_id = ?");
                $imgStmt->execute([$id]);
                $survey['images'] = $imgStmt->fetchAll(PDO::FETCH_COLUMN);
                echo json_encode($survey);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Survey not found"]);
            }
        } else {
            // Basic GET to fetch all surveys
            $user = isset($_GET['user']) ? $_GET['user'] : 'surveyor';
            
            if ($user === 'admin') {
                $stmt = $pdo->query("SELECT * FROM surveys ORDER BY created_date DESC LIMIT 100");
            } else {
                // If not admin, only show their own surveys based on their username string
                $stmt = $pdo->prepare("SELECT * FROM surveys WHERE created_by = ? ORDER BY created_date DESC LIMIT 100");
                $stmt->execute([$user]);
            }
            
            $surveys = $stmt->fetchAll();
            echo json_encode($surveys);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch surveys: " . $e->getMessage()]);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if (!$id) {
        echo json_encode(["error" => "Survey ID is required for deletion"]);
        exit;
    }

    try {
        // Fetch survey_images to clean up physical image upload files
        $imgStmt = $pdo->prepare("SELECT file_path FROM survey_images WHERE survey_id = ?");
        $imgStmt->execute([$id]);
        $images = $imgStmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($images as $img) {
            $filePath = '../' . $img['file_path'];
            if (file_exists($filePath)) {
                @unlink($filePath);
            }
        }

        // Delete survey folder if empty
        $surveyFolder = '../uploads/borewell/survey_' . $id;
        if (file_exists($surveyFolder) && is_dir($surveyFolder)) {
            @rmdir($surveyFolder);
        }

        // Delete survey from main table in MySQL database
        $delStmt = $pdo->prepare("DELETE FROM surveys WHERE survey_id = ?");
        $delStmt->execute([$id]);

        // Clean up survey_images records
        $delImgStmt = $pdo->prepare("DELETE FROM survey_images WHERE survey_id = ?");
        $delImgStmt->execute([$id]);

        echo json_encode(["success" => true, "message" => "Borewell survey deleted successfully from phpMyAdmin database"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete survey: " . $e->getMessage()]);
    }
}
?>
