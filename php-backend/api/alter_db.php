<?php
require_once '../db.php';

try {
    // 1. Change the column type from INT to VARCHAR(50)
    $pdo->exec("ALTER TABLE surveys MODIFY created_by VARCHAR(50) DEFAULT NULL");
    
    // 2. Convert old surveyor data (which used '2') to 'iitk1' as a default
    $pdo->exec("UPDATE surveys SET created_by = 'iitk1' WHERE created_by = '2'");
    
    // 3. Convert old admin data (which used '1') to 'admin'
    $pdo->exec("UPDATE surveys SET created_by = 'admin' WHERE created_by = '1'");
    
    echo "Database successfully altered to support dynamic usernames!";
} catch (Exception $e) {
    echo "Error updating database: " . $e->getMessage();
}
?>
