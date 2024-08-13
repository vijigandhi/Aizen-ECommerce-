<?php
session_start();
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Handle preflight requests
    http_response_code(200);
    exit();
}

require_once '../../vendor/autoload.php';
require_once '../../model/Connection.php';
require_once '../../utils/jwt.php'; // Include JWT functions

$response = [];

$headers = apache_request_headers();
$authHeader = $headers['Authorization'] ?? '';

if (strpos($authHeader, 'Bearer ') === 0) {
    $token = str_replace('Bearer ', '', $authHeader);
    $key = '2dafac1e167d361ac1270103f471a562fb89207ffae675a20a2137ee1fd0359f'; // Replace with your secret key

    try {
        $decoded = decodeJWT($token, $key);

        // Check if the token is valid
        if ($decoded) {
            // Extract user details from decoded token
            $userId = $decoded['sub'];
            $email = $decoded['email'];
            $roleId = $decoded['role_id'];

            // Return user details
            $response['status'] = 'success';
            $response['message'] = 'User details retrieved successfully';
            $response['user'] = [
                'id' => $userId,
                'email' => $email,
                'role_id' => $roleId
            ];
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
