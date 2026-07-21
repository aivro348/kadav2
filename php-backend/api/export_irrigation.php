<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../db.php';

$type = isset($_GET['type']) ? $_GET['type'] : '';

if ($type !== 'hnss' && $type !== 'palar') {
    echo json_encode(["error" => "Invalid survey type"]);
    exit;
}

$mainTable = $type === 'hnss' ? 'survey_hnss' : 'survey_palar';
$pointsTable = $type === 'hnss' ? 'survey_hnss_points' : 'survey_palar_points';
$uploadDir = '../uploads/' . $type . '/';

try {
    // 1. Fetch all surveys
    $stmt = $pdo->query("SELECT * FROM $mainTable ORDER BY created_at DESC");
    $surveys = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Create CSV in memory (temp file)
    $csvTemp = tmpfile();
    
    // Write Headers
    $headers = [
        'Survey ID', 'Surveyor', 'Village', 'Mandal', 'Panchayat', 
        'Total Length (m)', 'Total Width (m)', 'GPS Lat', 'GPS Lng', 'GPS Accuracy (m)', 'Date',
        'Photo East', 'Photo West', 'Photo North', 'Photo South',
        'Point 1 Value', 'Point 2 Value', 'Point 3 Value', 'Point 4 Value', 'Point 5 Value', 'Point 6 Value', 'Point 7 Value'
    ];
    fputcsv($csvTemp, $headers);

    $filesToZip = []; // Track images to include

    foreach ($surveys as $survey) {
        $row = [
            $survey['id'],
            $survey['surveyor_id'],
            $survey['village'],
            $survey['mandal'],
            $survey['panchayat'],
            $survey['total_length'],
            $survey['total_width'],
            $survey['gps_lat'],
            $survey['gps_lng'],
            $survey['gps_accuracy'],
            $survey['created_at'],
            $survey['photo_east'],
            $survey['photo_west'],
            $survey['photo_north'],
            $survey['photo_south']
        ];

        // Track images if they exist
        $photos = ['photo_east', 'photo_west', 'photo_north', 'photo_south'];
        foreach ($photos as $photoField) {
            if (!empty($survey[$photoField])) {
                $filePath = $uploadDir . $survey[$photoField];
                if (file_exists($filePath)) {
                    $filesToZip[$survey[$photoField]] = $filePath;
                }
            }
        }

        // Fetch points for this survey
        $ptStmt = $pdo->prepare("SELECT * FROM $pointsTable WHERE survey_id = ? ORDER BY point_number ASC");
        $ptStmt->execute([$survey['id']]);
        $points = $ptStmt->fetchAll(PDO::FETCH_ASSOC);
        
        $pointValues = array_fill(0, 7, ''); // default empty
        foreach ($points as $pt) {
            $num = (int)$pt['point_number'];
            if ($num >= 1 && $num <= 7) {
                $pointValues[$num - 1] = $pt['point_value'];
            }
        }

        $row = array_merge($row, $pointValues);
        fputcsv($csvTemp, $row);
    }

    // 3. Create ZIP Archive
    $zipFile = tempnam(sys_get_temp_dir(), "zip");
    $zip = new ZipArchive();
    
    if ($zip->open($zipFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== TRUE) {
        throw new Exception("Cannot create zip file.");
    }

    // Add CSV to zip
    rewind($csvTemp);
    $csvContent = stream_get_contents($csvTemp);
    $zip->addFromString(strtoupper($type) . "_Data.csv", $csvContent);
    fclose($csvTemp);

    // Add Images to zip
    foreach ($filesToZip as $fileName => $filePath) {
        $zip->addFile($filePath, "images/" . $fileName);
    }

    $zip->close();

    // 4. Stream Zip to Browser
    header('Content-Type: application/zip');
    header('Content-disposition: attachment; filename=' . strtoupper($type) . '_Export_' . date('Ymd_His') . '.zip');
    header('Content-Length: ' . filesize($zipFile));
    readfile($zipFile);

    // 5. Cleanup
    unlink($zipFile);
    exit;

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
