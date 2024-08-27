<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php';
require '../../model/Connection.php';

try {
    // Connect to the database
    $objDb = new DbConnect();
    $pdo = $objDb->connect();
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['details']) || !isset($data['user_id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit();
    }

    $details = $data['details'];
    $requestUserId = $data['user_id'];

    // Check if the requestUserId exists and fetch its role_id and email
    $stmt = $pdo->prepare("SELECT role_id, email, name FROM users WHERE id = :user_id");
    $stmt->bindParam(':user_id', $requestUserId, PDO::PARAM_INT);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit();
    }

    $userRoleId = $user['role_id'];
    $loggedInUserEmail = $user['email'];
    $loggedInUserName = $user['name'];

    // Insert request into the database
    $stmt = $pdo->prepare("INSERT INTO requests (user_id, request_details) VALUES (:user_id, :details)");
    $stmt->bindParam(':user_id', $requestUserId);
    $stmt->bindParam(':details', $details);

    if ($stmt->execute()) {
        if ($userRoleId) { // Temporarily remove the role check for testing
            $mail = new PHPMailer(true);

            try {
                // SMTP server settings
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com';
                $mail->SMTPAuth   = true;
                $mail->Username   = 'aizendckap@gmail.com';
                $mail->Password   = 'nxwe euhq phcg zjsz';
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = 587;
                $mail->SMTPDebug  = 2; // Debug output

                // Fetch email addresses of all users with role_id = 1
                $stmt = $pdo->prepare("SELECT email FROM users WHERE role_id = 1");
                $stmt->execute();
                $roleOneUserEmails = $stmt->fetchAll(PDO::FETCH_COLUMN);

                if (!$roleOneUserEmails) {
                    throw new Exception('No email addresses found for role_id = 1');
                }

                // Set up email
                $mail->setFrom($loggedInUserEmail, 'Vendor Request');
                $mail->isHTML(true);
                $mail->Subject = 'New Vendor Request';
                $imageUrl = 'https://appinventiv.com/wp-content/uploads/2021/09/Build-An-Organic-E-commerce-Platform.png';
                $mail->Body = '
                <html>
                <head>
                    <style>
                        body {
                            font-family: Montserrat, sans-serif;
                            color: #333;
                            line-height: 1.6;
                            margin: 0;
                            padding: 20px;
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
                        h3 {
                            color: #004d99;
                            text-align: center;
                        }
                        
                        .details {
                            margin-bottom: 20px;
                        }
                        .details strong {
                            color: #333;
                        }
                       
                        img {
                            width: 100%;
                            max-width: 700px;
                            max-height:500px;
                            border-radius: 8px;
                        }
                        .logo {
                            font-family: Montserrat, cursive;
                            color: #4CAF50; /* Green color */
                            font-size: 48px; /* Large font size */
                            font-weight: bold;
                            text-align: center;
                            margin: 20px 0;
                        }
                     </style>
                </head>
                <body>
                    <div class="container">
                        <h1 class="logo">Aizen</h1>
                        <h3>New Vendor Request Submitted</h3>
                        <div class="details">
                            <p><strong>User ID:</strong> ' . htmlspecialchars($requestUserId) . '</p>
                            <p><strong>User Name:</strong> ' . htmlspecialchars($loggedInUserName) . '</p>
                            <p><strong>Details:</strong> ' . htmlspecialchars($details) . '</p>
                        </div>
                            <img src="' . $imageUrl . '" alt="Vendor Request Image">
                        <p>Thank you for your attention to this matter.</p>
                    </div>
                </body>
                </html>
                ';
                
                

                // Add all email addresses to recipients
                foreach ($roleOneUserEmails as $email) {
                    $mail->addAddress($email);
                }

                $mail->send();
                echo json_encode(['success' => true, 'message' => 'Request submitted and email sent']);
            } catch (Exception $e) {
                error_log('PHPMailer Error: ' . $e->getMessage());
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to send email: ' . $e->getMessage()]);
            }
        } else {
            echo json_encode(['success' => true, 'message' => 'Request submitted but email not sent']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to insert request']);
    }
} catch (Exception $e) {
    // Log general errors
    error_log('Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Internal Server Error: ' . $e->getMessage()]);
}
?>