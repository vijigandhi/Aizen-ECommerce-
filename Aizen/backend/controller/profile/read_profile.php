<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$userId = $_GET['user_id'] ?? null;

if (empty($userId)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'User ID is required']);
    exit();
}

// Database connection
require_once '../../vendor/autoload.php';
require_once '../../model/Connection.php';
$dbConnect = new DbConnect();
$conn = $dbConnect->connect();

if ($conn) {
    $stmt = $conn->prepare("SELECT * FROM users WHERE id = :id");
    $stmt->bindParam(':id', $userId, PDO::PARAM_INT);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Add base URL to avatar path if it exists
        if (!empty($user['avatar'])) {
            $user['avatar'] = 'http://localhost:8000/controller/profile/uploads/' . $user['avatar']; 
        } else {
            $user['avatar'] = null; // Or set a default avatar URL
        }

        echo json_encode($user);
    } else {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
    }

    $conn = null;
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
}
?>
