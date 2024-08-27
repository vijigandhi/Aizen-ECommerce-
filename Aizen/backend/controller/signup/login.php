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
require_once'../../utils/jwt.php'; // Include JWT functions

$data = json_decode(file_get_contents('php://input'), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

$response = [];

if ($email && $password) {
    $dbConnect = new DbConnect();
    $conn = $dbConnect->connect();

    if ($conn) {
        $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            if (password_verify($password, $user['password_hash'])) {


                $_SESSION['user_id'] = $user['id'];
                $_SESSION['name'] = $user['name'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['role_id'] = $user['role_id'];
                // JWT Header
                $header = [
                    'alg' => 'HS256',
                    'typ' => 'JWT'
                ];

                // JWT Payload
                $payload = [
                    'sub' => $user['id'], // User ID
                    'email' => $user['email'],
                    'role_id' => $user['role_id'],
                    'exp' => time() + 3600 // Token expires in 1 hour
                ];

                $key = '2dafac1e167d361ac1270103f471a562fb89207ffae675a20a2137ee1fd0359f'; // Replace with your secret key
                $token = createJWT($header, $payload, $key);

                $response['status'] = 'success';
                $response['message'] = 'Login successful';
                $response['token'] = $token;
                $response['id'] = $user['id']; // Include user ID in the response
                $response['role_id'] = $user['role_id'];
                echo json_encode($response);
                exit;
                
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Invalid password';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'User not found';
        }

        $conn = null;
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Database connection failed';
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'All fields are required';
}

echo json_encode($response);

?>
