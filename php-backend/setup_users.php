<?php
require_once 'db.php';

try {
    $pdo->exec("SET FOREIGN_KEY_CHECKS=0");
    
    // First, make sure the users table exists (create it if missing)
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'surveyor',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
    // Insert the two required users
    $stmt = $pdo->prepare("INSERT IGNORE INTO users (id, username, password, role) VALUES (?, ?, ?, ?)");
    
    // Create admin user
    $stmt->execute([1, 'admin', password_hash('admin123', PASSWORD_DEFAULT), 'admin']);
    
    // Create surveyor user
    $stmt->execute([2, 'surveyor', password_hash('surveyor123', PASSWORD_DEFAULT), 'surveyor']);
    
    $pdo->exec("SET FOREIGN_KEY_CHECKS=1");
    
    echo "<h1>Success!</h1>";
    echo "<p>Database users setup successfully. You can now submit surveys!</p>";
    
} catch (Exception $e) {
    echo "<h1>Error</h1>";
    echo "<p>" . htmlspecialchars($e->getMessage()) . "</p>";
}
?>
