<?php
require_once '../db.php';
require_once '../jwt.php';

header('Content-Type: application/json');

// This will block requests without a valid Bearer token
$userPayload = JWT::authenticate();
$username = $userPayload['username'];
$role = $userPayload['role'];

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit();
}

try {
    // 1. Overall Status Counts
    $statusStmt = $pdo->query("SELECT status, COUNT(*) as count FROM surveys GROUP BY status");
    $statuses = $statusStmt->fetchAll();
    
    $total = 0;
    $successful = 0;
    $seasonal = 0;
    $dried = 0;
    
    foreach ($statuses as $row) {
        $count = (int)$row['count'];
        $total += $count;
        if ($row['status'] === 'Successful') $successful += $count;
        else if ($row['status'] === 'Dried') $dried += $count;
        else $seasonal += $count;
    }
    
    // 2. Village-wise surveys (Top 6)
    $villageStmt = $pdo->query("SELECT village, COUNT(*) as count FROM surveys GROUP BY village ORDER BY count DESC LIMIT 6");
    $villages = $villageStmt->fetchAll();
    $villageLabels = [];
    $villageData = [];
    foreach ($villages as $v) {
        $villageLabels[] = $v['village'];
        $villageData[] = (int)$v['count'];
    }
    
    // 3. Water Quality Distribution (Safe < 500, Moderate 500-1000, Unsafe > 1000)
    $safe = 0;
    $moderate = 0;
    $unsafe = 0;
    
    $tdsStmt = $pdo->query("SELECT tds FROM surveys WHERE tds IS NOT NULL AND tds > 0");
    $tdsRows = $tdsStmt->fetchAll();
    foreach ($tdsRows as $row) {
        $tds = (float)$row['tds'];
        if ($tds < 500) $safe++;
        else if ($tds <= 1000) $moderate++;
        else $unsafe++;
    }
    
    // 4. Utilization (Agriculture, Livestock, Domestic)
    $agri = 0;
    $livestock = 0;
    $domestic = 0;
    
    $utilStmt = $pdo->query("SELECT borewell_type FROM surveys WHERE borewell_type IS NOT NULL AND borewell_type != ''");
    $utilRows = $utilStmt->fetchAll();
    $totalUtil = 0;
    foreach ($utilRows as $row) {
        $type = strtolower($row['borewell_type']);
        if (strpos($type, 'agriculture') !== false) { $agri++; $totalUtil++; }
        if (strpos($type, 'livestock') !== false) { $livestock++; $totalUtil++; }
        if (strpos($type, 'drinking') !== false || strpos($type, 'domestic') !== false) { $domestic++; $totalUtil++; }
    }
    
    $agriPct = $totalUtil > 0 ? round(($agri / $totalUtil) * 100) : 0;
    $livestockPct = $totalUtil > 0 ? round(($livestock / $totalUtil) * 100) : 0;
    $domesticPct = $totalUtil > 0 ? round(($domestic / $totalUtil) * 100) : 0;

    echo json_encode([
        "status" => [
            "total" => $total,
            "successful" => $successful,
            "seasonal" => $seasonal,
            "dried" => $dried
        ],
        "villages" => [
            "labels" => $villageLabels,
            "data" => $villageData
        ],
        "water_quality" => [
            "safe" => $safe,
            "moderate" => $moderate,
            "unsafe" => $unsafe
        ],
        "utilization" => [
            "agriculture" => $agriPct,
            "livestock" => $livestockPct,
            "domestic" => $domesticPct
        ]
    ]);

} catch (Exception $e) {
    error_log("Failed to fetch analytics: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch analytics due to an internal server error."]);
}
?>
