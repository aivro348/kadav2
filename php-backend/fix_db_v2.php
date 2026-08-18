<?php
require_once 'db.php';

try {
    $pdo->exec("SET FOREIGN_KEY_CHECKS=0");
    
    // Drop the old table entirely 
    $pdo->exec("DROP TABLE IF EXISTS survey_images");
    
    // Recreate it with file_path and ON DELETE CASCADE
    $pdo->exec("CREATE TABLE survey_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        survey_id INT NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (survey_id) REFERENCES surveys(survey_id) ON DELETE CASCADE
    )");
    
    $pdo->exec("SET FOREIGN_KEY_CHECKS=1");
    
    echo "<h1>Success!</h1>";
    echo "<p>Database tables updated successfully.</p>";
    echo "<p>1. survey_images table reverted to store physical file paths.</p>";
    echo "<p>2. ON DELETE CASCADE constraint applied successfully.</p>";
    
} catch (Exception $e) {
    echo "<h1>Error</h1>";
    echo "<p>" . htmlspecialchars($e->getMessage()) . "</p>";
}
?>
