<?php
// Enable CORS and error reporting
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Cross-Origin-Opener-Policy: same-origin");
header("Cross-Origin-Embedder-Policy: require-corp");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require '../../vendor/autoload.php';
require '../../model/Connection.php';

use Google\Client as GoogleClient;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Initialize database connection
$objdb = new DbConnect();
$conn = $objdb->connect();

// Initialize Google Client
$client = new GoogleClient();
$client->setClientId('995387049773-1l8a7e3q87cp7d38i18lfr09au8027rr.apps.googleusercontent.com');
$client->setClientSecret('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');
$client->setRedirectUri('http://localhost:3000');
$client->addScope('profile');
$client->addScope('email');

header('Content-Type: application/json');

// Read POST data
$data = $_POST['key'] ?? null;

if (!$data) {
    echo json_encode(['message' => 'Token is required']);
    http_response_code(400);
    exit();
}

// Debugging: Log the received key
error_log('Received key: ' . $data);

try {
    // Verify the ID token using Google's API
    $payload = $client->verifyIdToken($data);

    if (!$payload) {
        throw new Exception('Invalid token');
    }

    // Debugging: Log the payload
    error_log('Payload: ' . print_r($payload, true));

    // Verify payload type and structure
    if (is_array($payload)) {
        $googleId = $payload['sub'] ?? null;
        $email = $payload['email'] ?? null;
        $name = $payload['name'] ?? null;
        $avatarUrl = $payload['picture'] ?? null; // Add this line to get the avatar URL

        if (!$googleId || !$email) {
            throw new Exception('Google ID or email is missing');
        }

        // Check if the user with the Google ID or email already exists in the database
        $stmt = $conn->prepare('SELECT * FROM users WHERE google_id = :googleId OR email = :email');
        $stmt->bindParam(':googleId', $googleId);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // User exists, generate JWT
            $jwt = createJWT([
                'alg' => 'HS256',
                'typ' => 'JWT'
            ], [
                'iat' => time(),
                'exp' => time() + 3600,
                'sub' => $user['id']
            ], '2dafac1e167d361ac1270103f471a562fb89207ffae675a20a2137ee1fd0359f');
            echo json_encode([
                "message" => "Login successful.",
                "jwt" => $jwt,
                "redirect" => "http://localhost:3000/home" // Redirect to home page
            ]);
            http_response_code(200);
            exit();
        } else {
            // Retrieve role ID for 'User'
            $roleStmt = $conn->prepare("SELECT id FROM roles WHERE name = 'User'");
            $roleStmt->execute();
            $roleResult = $roleStmt->fetch(PDO::FETCH_ASSOC);

            if (!$roleResult) {
                throw new Exception('User role not found');
            }

            $roleId = $roleResult['id'];

            // Insert the new user into the database
            $query = "INSERT INTO users (google_id, name, email, password_hash, role_id, is_verified, avatar) VALUES (:googleId, :name, :email, '', :roleId, 1, :avatar)";
            $stmt = $conn->prepare($query);

            $stmt->bindParam(':googleId', $googleId);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':avatar', $avatarUrl); // Bind the avatar URL
            $stmt->bindParam(':roleId', $roleId); // Bind the dynamic role ID

            $stmt->execute();

            // Generate JWT after successful registration
            
            $newUserId = $conn->lastInsertId();
            $jwt = createJWT([
                'alg' => 'HS256',
                'typ' => 'JWT'
            ], [
                'iat' => time(),
                'exp' => time() + 3600,
                'sub' => $newUserId
            ], '2dafac1e167d361ac1270103f471a562fb89207ffae675a20a2137ee1fd0359f');

            echo json_encode([
                "message" => "Registration successful.",
                "jwt" => $jwt,
                "redirect" => "http://localhost:3000/login" // Redirect to login page
            ]);
            http_response_code(200);

            // Send confirmation email
            
            $mail = new PHPMailer(true);
            try {
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com';
                $mail->SMTPAuth   = true;
                $mail->Username   = 'aizendckap@gmail.com';
                $mail->Password   = 'nxwe euhq phcg zjsz'; // Check for spaces or special characters
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = 587;

                $mail->setFrom('aizendckap@gmail.com', 'Aizen Dckap');
                $mail->addAddress($email, $name);

                $mail->isHTML(true);
                $mail->Subject = 'Registration Successful';

                $imageUrl = 'https://static.vecteezy.com/system/resources/previews/002/823/532/non_2x/welcome-to-hotel-flat-color-illustration-hospitality-business-accommodation-service-hall-porter-doorman-resort-manager-working-staff-isolated-cartoon-characters-on-white-vector.jpg';

                $mail->Body = '
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            color: #333;
                            line-height: 1.6;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f4;
                        }
                        .container {
                            max-width: 600px;
                            margin: auto;
                            background: #f9f9f9;
                            border-radius: 8px;
                            overflow: hidden;
                            padding: 20px;
                            box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        }
                        .header {
                            background: black;
                            color: #fff;
                            padding: 20px;
                            text-align: center;
                        }
                        .header img {
                            max-width: 150px;
                        }
                        .content {
                            padding: 20px;
                        }
                        .content h2 {
                            color: green;
                            font-size: 24px;
                            margin-bottom: 10px;
                        }
                        .content p {
                            margin: 0 0 15px;
                        }
                        .content img {
                            max-width: 100%;
                            height: auto;
                            display: block;
                            margin: 20px 0;
                        }
                        .footer {
                            background: black;
                            color: #666;
                            padding: 20px;
                            text-align: center;
                            font-size: 12px;
                        }
                        .footer p {
                            color: white;
                            text-decoration: none;
                        }
                        .logo {
                            font-family: Montserrat, cursive;
                            color: #4CAF50; /* Green color */
                            font-size: 48px; /* Large font size */
                            font-weight: bold;
                            text-align: center;
                            margin: 20px 0;
                        }
                        .button {
                            display: inline-block;
                            font-size: 16px;
                            color: #fff;
                            background-color: #4CAF50;
                            padding: 12px 24px;
                            text-decoration: none;
                            border-radius: 5px;
                            text-align: center;
                            margin: 20px 0;
                            border: 1px solid #4CAF50;
                            transition: background-color 0.3s, color 0.3s;
                        }
                        .button:hover {
                            background-color: #45a049;
                            color: #fff;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 class="logo">Welcome to Aizen</h1>
                        </div>
                        <div class="content">
                            <h2>Hi ' . htmlspecialchars($name) . ',</h2>
                            <p>Welcome! Your registration is completed.</p>
                            <img src="' . $imageUrl . '" alt="Welcome Image">
                            <a href="http://localhost:3000/home" class="button">Go to Aizen</a>
                            <p>If you have any questions, feel free to <a href="mailto:aizendckap@gmail.com">contact us</a>.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; ' . date("Y") . ' Aizen. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>';

                $mail->send();
            } catch (Exception $e) {
                error_log('Mail error: ' . $mail->ErrorInfo);
            }

            exit();
        }
    } else {
        throw new Exception('Invalid payload format');
    }
} catch (Exception $e) {
    echo json_encode(['message' => $e->getMessage()]);
    http_response_code(400);
    exit();
}

// Function to create a JWT
function createJWT($header, $payload, $key) {
    $headerEncoded = base64_encode(json_encode($header));
    $payloadEncoded = base64_encode(json_encode($payload));
    $signature = hash_hmac('sha256', $headerEncoded . '.' . $payloadEncoded, $key, true);
    $signatureEncoded = base64_encode($signature);

    return $headerEncoded . '.' . $payloadEncoded . '.' . $signatureEncoded;
}




?>
