<?php
require_once '../db.php';
require_once '../jwt.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Username and password are required"]);
    exit();
}

$username = strtolower(trim($data['username']));
$password = $data['password'];

try {
    // 1. Fetch user from DB (wrap in try-catch in case table doesn't exist yet)
    $user = null;
    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();
    } catch (Exception $dbError) {
        // Table might not exist, silently ignore and rely on legacy fallback below
    }

    // 2. Validate user
    // Fallback logic for legacy IITK users if they aren't in DB yet
    $isIitkUser = preg_match('/^iitk([1-9]|[1-9][0-9]|100)$/', $username) && $password === $username;
    
    $validDbUser = false;
    if ($user && password_verify($password, $user['password'])) {
        $validDbUser = true;
    }

    if ($validDbUser || $isIitkUser) {
        $role = $validDbUser ? $user['role'] : 'surveyor';
        
        // 3. Generate Token (valid for 24 hours)
        $payload = [
            'username' => $username,
            'role' => $role,
            'iat' => time(),
            'exp' => time() + (24 * 60 * 60)
        ];
        
        $token = JWT::encode($payload);
        
        echo json_encode([
            "success" => true,
            "token" => $token,
            "user" => [
                "username" => $username,
                "role" => $role
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Invalid username or password"]);
    }
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Internal server error during login"]);
}
?>
