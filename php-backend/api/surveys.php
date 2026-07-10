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
                crop_category, crop_names, dependent_families, dependent_animals, agri_land_area
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        ");
        
        $stmt->execute([
            $data['mandal'] ?? null,
            $data['panchayat'] ?? null,
            $data['village'] ?? null,
            $data['latitude'] ?? null,
            $data['longitude'] ?? null,
            $data['status'] ?? null,
            $data['borewell_type'] ?? null,
            $data['supply_nature'] ?? null,
            $data['borewell_depth'] ?? null,
            $data['motor_capacity'] ?? null,
            $data['motor_depth'] ?? null,
            $data['delivery_pipe'] ?? null,
            $data['water_level_fixing'] ?? null,
            $data['water_struck_depth'] ?? null,
            $data['tds'] ?? null,
            $data['ph'] ?? null,
            $data['hardness'] ?? null,
            $data['drilled_year'] ?? null,
            $data['dried_year'] ?? null,
            $data['dried_months'] ?? null,
            $data['crop_category'] ?? null,
            $data['crop_names'] ?? null,
            $data['dependent_families'] ?? null,
            $data['dependent_animals'] ?? null,
            $data['agri_land_area'] ?? null
        ]);
        
        $survey_id = $pdo->lastInsertId();
        
        // Process images
        if (isset($data['images']) && is_array($data['images'])) {
            $imgStmt = $pdo->prepare("INSERT INTO survey_images (survey_id, file_path) VALUES (?, ?)");
            
            foreach ($data['images'] as $base64) {
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
                    $filename = 'survey_' . $survey_id . '_' . uniqid() . '.' . $ext;
                    $filepath = '../uploads/' . $filename;
                    
                    if (file_put_contents($filepath, $imgData)) {
                        $imgStmt->execute([$survey_id, 'uploads/' . $filename]);
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
    // Basic GET to fetch surveys
    try {
        $stmt = $pdo->query("SELECT * FROM surveys ORDER BY created_date DESC LIMIT 100");
        $surveys = $stmt->fetchAll();
        echo json_encode($surveys);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch surveys: " . $e->getMessage()]);
    }
}
?>
