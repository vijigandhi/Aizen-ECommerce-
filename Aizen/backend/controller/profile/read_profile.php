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
        // Debug: Log the retrieved avatar field from the database
        error_log("Retrieved Avatar Field: " . $user['avatar']);

        // Check if avatar is an external URL
        if (!empty($user['avatar']) && (strpos($user['avatar'], 'http://') === 0 || strpos($user['avatar'], 'https://') === 0)) {
            // Debug: Log the external URL
            error_log("Using external avatar URL: " . $user['avatar']);
            $user['avatar'] = $user['avatar']; // Use the external URL as is
        } else {
            // Construct URL for local avatars
            if (!empty($user['avatar'])) {
                $user['avatar'] = 'http://localhost:8000/controller/profile/uploads/' . $user['avatar'];
                // Debug: Log the constructed local URL
                error_log("Constructed local avatar URL: " . $user['avatar']);
            } else {
                // Optional: Set a default avatar URL if no avatar is found
                $user['avatar'] = 'http://localhost:8000/controller/profile/uploads/default-avatar.png';
                // Debug: Log the default URL
                error_log("No avatar found, using default avatar URL: " . $user['avatar']);
            }
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
