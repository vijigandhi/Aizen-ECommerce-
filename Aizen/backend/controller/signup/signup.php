 <?php 

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php';
require '../../model/Connection.php';

$objdb = new DbConnect();
$conn = $objdb->connect();

$data = json_decode(file_get_contents('php://input'), true);

$firstname = $data['name'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$confirmPassword = $data['confirmPassword'] ?? '';

$response = [];

try {
    if (empty($firstname) || empty($email) || empty($password) || empty($confirmPassword)) {
        throw new Exception('All fields are required');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }

    if ($password !== $confirmPassword) {
        throw new Exception('Passwords do not match');
    }

    if (!$conn) {
        throw new Exception('Database connection failed');
    }

    // Check if email already exists
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $existingUser = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existingUser) {
        throw new Exception('Email already exists');
    }

    // Get role_id for 'User'
    $roleStmt = $conn->prepare("SELECT id FROM roles WHERE name = 'User'");
    $roleStmt->execute();
    $roleResult = $roleStmt->fetch(PDO::FETCH_ASSOC);

    if (!$roleResult) {
        throw new Exception('User role not found');
    }

    $roleId = $roleResult['id'];

    // Insert new user into database
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $statement = $conn->prepare("INSERT INTO users (name, email, password_hash, role_id, is_verified) 
                                VALUES (:firstname, :email, :password, :role_id, 1)");
    $statement->bindParam(':firstname', $firstname);
    $statement->bindParam(':email', $email);
    $statement->bindParam(':password', $hashedPassword);
    $statement->bindParam(':role_id', $roleId);

    if ($statement->execute()) {
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
                        font-family: Montserrat, sans-serif;
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

            $response['status'] = 'success';
            $response['message'] = 'Registration successful. Please check your email for confirmation.';
        } catch (Exception $e) {
            error_log('Mailer Error: ' . $mail->ErrorInfo);
            throw new Exception('Registration successful, but confirmation email could not be sent. Mailer Error: ' . $mail->ErrorInfo);
        }
    } else {
        throw new Exception('Registration failed');
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
