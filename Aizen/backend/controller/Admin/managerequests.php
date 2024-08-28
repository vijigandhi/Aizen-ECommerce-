<?php
// Include database connection file


header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php';
include 'db_connect.php';



// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get action type and request ID from the POST request
    $action = $_POST['action'] ?? null;
    $requestId = intval($_POST['requestId'] ?? 0);

    if ($action && $requestId) {
        // Initialize a variable to hold the new status
        $newStatus = 0;
        $newUserRole = null;

        // Determine new status and user role based on the action
        if ($action === 'approve') {
            $newStatus = 1;
            $newUserRole = 2;

            $getUserEmailSql = "SELECT u.email FROM users u JOIN requests r ON u.id = r.user_id WHERE r.id = ?";
            $stmt = $conn->prepare($getUserEmailSql);
            $stmt->bind_param('i', $requestId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();
                $userEmail = $user['email'];

                try {
                    $mail = new PHPMailer(true);
                    $mail->isSMTP();
                    $mail->Host       = 'smtp.gmail.com';
                    $mail->SMTPAuth   = true;
                    $mail->Username   = 'aizendckap@gmail.com';
                    $mail->Password   = 'nxwe euhq phcg zjsz'; 
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                    $mail->Port       = 587;

                    // Set email parameters
                    $mail->setFrom('aizendckap@gmail.com', 'Aizen Dckap');
                    $mail->addAddress($userEmail);

                    // Email content
                    $mail->isHTML(true);
                    $mail->Subject = 'Request Approval Notification';
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
                                background: #4CAF50; /* Green for approval */
                                color: #fff;
                                padding: 20px;
                                text-align: center;
                            }
                            .content {
                                padding: 20px;
                            }
                            .content h2 {
                                font-size: 24px;
                                margin-bottom: 10px;
                            }
                            .content p {
                                margin: 0 0 15px;
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
                                color: white; /* Green color */
                                font-size: 48px;
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
                                <h1 class="logo">Approval</h1>
                            </div>
                            <div class="content">
                                <h2>Dear User,</h2>
                                <p>Congratulations! Your request has been approved.</p>
                                <a href="http://localhost:3000/aizen-seller/dashboard" class="button">Go to Dashboard</a>
                                <p>Thank you for your patience.</p>
                            </div>
                            <div class="footer">
                                <p>&copy; ' . date("Y") . ' Aizen. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                    </html>';
                    
                    // Send the email
                    $mail->send();
                } catch (Exception $e) {
                    echo json_encode(['status' => 'error', 'message' => "Mailer Error: {$mail->ErrorInfo}"]);
                    exit;
                }
            } else {
                echo json_encode(['status' => 'error', 'message' => 'User not found']);
                exit;
            }// Assuming role ID 2 is for approved users
        }
         elseif ($action === 'reject') {
            $newStatus = 2;
       

        $getUserEmailSql = "SELECT u.email FROM users u JOIN requests r ON u.id = r.user_id WHERE r.id = ?";
        $stmt = $conn->prepare($getUserEmailSql);
        $stmt->bind_param('i', $requestId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $userEmail = $user['email'];

            // Send rejection email
            try {
                $mail = new PHPMailer(true);
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com';
                $mail->SMTPAuth   = true;
                $mail->Username   = 'aizendckap@gmail.com';
                $mail->Password   = 'nxwe euhq phcg zjsz'; 
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = 587;

                // Set email parameters
                $mail->setFrom('aizendckap@gmail.com', 'Aizen Dckap');
                $mail->addAddress($userEmail);

                // Email content
                $mail->isHTML(true);
                $mail->Subject = 'Request Rejection Notification';
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
                            background: #FF4C4C; /* Red for rejection */
                            color: #fff;
                            padding: 20px;
                            text-align: center;
                        }
                        .content {
                            padding: 20px;
                        }
                        .content h2 {
                            font-size: 24px;
                            margin-bottom: 10px;
                        }
                        .content p {
                            margin: 0 0 15px;
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
                            color: white; /* Red color */
                            font-size: 48px;
                            font-weight: bold;
                            text-align: center;
                            margin: 20px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 class="logo">Rejection</h1>
                        </div>
                        <div class="content">
                            <h2>Dear User,</h2>
                            <p>We regret to inform you that your request has been rejected.</p>
                            <p>Thank you.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; ' . date("Y") . ' Aizen. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>';
                
                // Send the email
                $mail->send();
            } catch (Exception $e) {
                echo json_encode(['status' => 'error', 'message' => "Mailer Error: {$mail->ErrorInfo}"]);
                exit;
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'User not found']);
            exit;
        }

        }

        // Prepare SQL statements for updating request status and user role
        $updateRequestSql = "UPDATE requests SET status = ? WHERE id = ?";
        $updateUserRoleSql = "UPDATE users SET role_id = ? WHERE id = (SELECT user_id FROM requests WHERE id = ?)";

        // Start a transaction
        mysqli_begin_transaction($conn);

        try {
            // Update request status
            $stmt = $conn->prepare($updateRequestSql);
            $stmt->bind_param('ii', $newStatus, $requestId);
            $stmt->execute();
            
            if ($newUserRole) {
                // Update user role if applicable
                $stmt = $conn->prepare($updateUserRoleSql);
                $stmt->bind_param('ii', $newUserRole, $requestId);
                $stmt->execute();
            }

            // Commit transaction
            mysqli_commit($conn);

            // Return success response
            echo json_encode(['status' => 'success']);
        } catch (Exception $e) {
            // Rollback transaction on error
            mysqli_rollback($conn);
            
            // Return error response
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }

        // Close the statement
        $stmt->close();
    } else {
        // Invalid request
        echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
    }

    // Close the database connection
    $conn->close();
} else {
    // Invalid request method
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
