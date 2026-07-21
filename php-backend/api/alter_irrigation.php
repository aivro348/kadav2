<?php
require_once '../db.php';

try {
    // HNSS Tables
    $pdo->exec("CREATE TABLE IF NOT EXISTS survey_hnss (
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

    $pdo->exec("CREATE TABLE IF NOT EXISTS survey_hnss_points (
        id INT AUTO_INCREMENT PRIMARY KEY,
        survey_id INT,
        point_number INT,
        latitude VARCHAR(50),
        longitude VARCHAR(50),
        point_value VARCHAR(255),
        photo LONGTEXT,
        FOREIGN KEY (survey_id) REFERENCES survey_hnss(id) ON DELETE CASCADE
    )");

    // Palar River Tables
    $pdo->exec("CREATE TABLE IF NOT EXISTS survey_palar (
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

    $pdo->exec("CREATE TABLE IF NOT EXISTS survey_palar_points (
        id INT AUTO_INCREMENT PRIMARY KEY,
        survey_id INT,
        point_number INT,
        latitude VARCHAR(50),
        longitude VARCHAR(50),
        point_value VARCHAR(255),
        photo LONGTEXT,
        FOREIGN KEY (survey_id) REFERENCES survey_palar(id) ON DELETE CASCADE
    )");

    echo "Irrigation tables successfully created!";
} catch (Exception $e) {
    echo "Error updating database: " . $e->getMessage();
}
?>
