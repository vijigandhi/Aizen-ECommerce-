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
            $mail->Password   = 'nxwe euhq phcg zjsz';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            $mail->setFrom('aizendckap@gmail.com', 'Aizen Dckap');
            $mail->addAddress($email, $firstname);

            $mail->isHTML(true);
            $mail->Subject = 'Registration Successful';

        
            $imageUrl = 'https://i.pinimg.com/564x/db/a8/db/dba8dbeae2578bb41f489ac0b0c716bc.jpg';

            $mail->Body = '
                <html>
                <body>
                    <strong>Hi ' . htmlspecialchars($firstname) . ',</strong> . <br>
                    <strong>Welcome! Your registration is complete. Dive into premium farm products and experience the natural goodness awaiting you!".</strong> . <br>
                    <p><img src="' . $imageUrl . '" alt="Welcome Image" style="width:100%; max-width:600px; height:auto; display:block;"></p>
                </body>
                </html>
            ';

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
