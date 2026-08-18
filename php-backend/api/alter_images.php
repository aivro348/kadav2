<?php
require_once '../db.php';

try {
    // Change file_path column from VARCHAR to LONGTEXT to support Base64 string storage
    $pdo->exec("ALTER TABLE survey_images MODIFY file_path LONGTEXT");
    echo "Database successfully altered to support Base64 images! You will never lose images to Git deployments again.";
} catch (Exception $e) {
    echo "Error updating database: " . $e->getMessage();
}
?>
