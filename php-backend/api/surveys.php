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
            ($data['created_by'] === 'admin' ? 1 : 2) // Map username string to INT
        ]);
        
        $survey_id = $pdo->lastInsertId();
        
        // Process images
        if (isset($data['images']) && is_array($data['images'])) {
            $imgStmt = $pdo->prepare("INSERT INTO survey_images (survey_id, image_data) VALUES (?, ?)");
            
            foreach ($data['images'] as $base64) {
                // Ensure we have a valid string before inserting
                if (is_string($base64) && !empty($base64)) {
                    $imgStmt->execute([$survey_id, $base64]);
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
                $imgStmt = $pdo->prepare("SELECT image_data FROM survey_images WHERE survey_id = ?");
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
                // If not admin (e.g. surveyor), only show their own surveys (ID 2)
                $stmt = $pdo->prepare("SELECT * FROM surveys WHERE created_by = 2 ORDER BY created_date DESC LIMIT 100");
                $stmt->execute();
            }
            
            $surveys = $stmt->fetchAll();
            echo json_encode($surveys);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch surveys: " . $e->getMessage()]);
    }
}
?>
