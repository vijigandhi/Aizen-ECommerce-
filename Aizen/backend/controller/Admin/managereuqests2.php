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

$requestId = $data['requestId'] ?? '';
$status = $data['status'] ?? '';
$response = [];

try {
    if (empty($requestId) || empty($status)) {
        throw new Exception('Request ID and status are required');
    }

    if (!$conn) {
        throw new Exception('Database connection failed');
    }

    // Update request status
    $stmt = $conn->prepare("UPDATE requests SET status = :status WHERE id = :requestId");
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':requestId', $requestId);

    if ($stmt->execute()) {
        // Fetch user details for notification
        $userStmt = $conn->prepare("SELECT users.email, users.name FROM requests JOIN users ON requests.user_id = users.id WHERE requests.id = :requestId");
        $userStmt->bindParam(':requestId', $requestId);
        $userStmt->execute();
        $user = $userStmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'aizendckap@gmail.com';
            $mail->Password   = 'nxwe euhq phcg zjsz'; // Use secure methods for credentials
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            $mail->setFrom('aizendckap@gmail.com', 'Aizen Dckap');
            $mail->addAddress($user['email'], $user['name']);
            $mail->isHTML(true);
            
            // Set email subject and body based on status
            if ($status === 'approved') {
                $mail->Subject = 'Request Approved';
                $mail->Body = '
                <html>
                <head>
                    <style>
                        /* Same or similar styling as registration email */
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 class="logo">Aizen Notification</h1>
                        </div>
                        <div class="content">
                            <h2>Hi ' . htmlspecialchars($user['name']) . ',</h2>
                            <p>Good news! Your request has been approved.</p>
                            <img src="https://example.com/approved-image.jpg" alt="Approved Image">
                            <a href="http://localhost:3000/dashboard" class="button">View Dashboard</a>
                            <p>If you have any questions, feel free to <a href="mailto:aizendckap@gmail.com">contact us</a>.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; ' . date("Y") . ' Aizen. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>';
            } elseif ($status === 'rejected') {
                $mail->Subject = 'Request Rejected';
                $mail->Body = '
                <html>
                <head>
                    <style>
                        /* Same or similar styling as registration email */
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 class="logo">Aizen Notification</h1>
                        </div>
                        <div class="content">
                            <h2>Hi ' . htmlspecialchars($user['name']) . ',</h2>
                            <p>We regret to inform you that your request has been rejected.</p>
                            <img src="https://example.com/rejected-image.jpg" alt="Rejected Image">
                            <a href="http://localhost:3000/support" class="button">Contact Support</a>
                            <p>If you have any questions or need further assistance, please <a href="mailto:aizendckap@gmail.com">contact us</a>.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; ' . date("Y") . ' Aizen. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>';
            }

            $mail->send();
            $response['status'] = 'success';
            $response['message'] = 'Request status updated and email sent.';
        } else {
            throw new Exception('User not found');
        }
    } else {
        throw new Exception('Failed to update request status');
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
