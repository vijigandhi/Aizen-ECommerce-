<?php
session_start();
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../vendor/autoload.php';
require_once '../../model/Connection.php';
require_once '../../utils/jwt.php';

$response = [];

use Google\Client as GoogleClient;

$headers = apache_request_headers();
$authHeader = $headers['Authorization'] ?? '';

if (strpos($authHeader, 'Bearer ') === 0) {
    $token = str_replace('Bearer ', '', $authHeader);
    $key = '2dafac1e167d361ac1270103f471a562fb89207ffae675a20a2137ee1fd0359f'; // Your JWT secret key

    try {
        $decoded = decodeJWT($token, $key);

        if ($decoded) {

            $userId = $decoded['sub'];

            $conn = new DbConnect();
            $pdo = $conn->connect();

            $stmt = $pdo->prepare('SELECT id, email, role_id FROM users WHERE id = :userId');
            $stmt->bindParam(':userId', $userId);
            $stmt->execute();

            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                $response['status'] = 'success';
                $response['message'] = 'User details retrieved successfully';
                $response['user'] = [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'role_id' => $user['role_id']
                ];
            } else {
                $response['status'] = 'error';
                $response['message'] = 'User not found';
            }

        } else {
            $response['status'] = 'error';
            $response['message'] = 'Invalid token';
        }
    } catch (Exception $e) {
        $response['status'] = 'error';
        $response['message'] = 'Token decoding failed: ' . $e->getMessage();
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'Authorization header missing or malformed';
}

echo json_encode($response);
?>
