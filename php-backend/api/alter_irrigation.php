<?php
// We must set $_GET['type'] so that db_irrigation.php connects to the correct database
if (!isset($_GET['type'])) {
    die("Error: Please provide ?type=hnss or ?type=palar in the URL to create tables in the correct database.");
}

$type = $_GET['type'];
if ($type !== 'hnss' && $type !== 'palar') {
    die("Error: Invalid type.");
}

require_once '../db_irrigation.php';

try {
    $mainTable = $type === 'hnss' ? 'survey_hnss' : 'survey_palar';
    $pointsTable = $type === 'hnss' ? 'survey_hnss_points' : 'survey_palar_points';

    $pdo->exec("CREATE TABLE IF NOT EXISTS $mainTable (
        id INT AUTO_INCREMENT PRIMARY KEY,
        surveyor_id VARCHAR(50) NOT NULL,
        village VARCHAR(100),
        mandal VARCHAR(100),
        panchayat VARCHAR(100),
        total_length DECIMAL(10,2),
        total_width DECIMAL(10,2),
        gps_lat VARCHAR(50),
        gps_lng VARCHAR(50),
        gps_accuracy VARCHAR(50),
        photo_east LONGTEXT,
        photo_west LONGTEXT,
        photo_north LONGTEXT,
        photo_south LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS $pointsTable (
        id INT AUTO_INCREMENT PRIMARY KEY,
        survey_id INT,
        point_number INT,
        latitude VARCHAR(50),
        longitude VARCHAR(50),
        point_value VARCHAR(255),
        photo LONGTEXT,
        FOREIGN KEY (survey_id) REFERENCES $mainTable(id) ON DELETE CASCADE
    )");

    echo "Successfully created tables ($mainTable and $pointsTable) in the $type database!";
} catch (Exception $e) {
    echo "Error updating database: " . $e->getMessage();
}
?>
