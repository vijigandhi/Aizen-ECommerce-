<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if user_id is set in POST data
    if (!isset($_POST['user_id'])) {
        http_response_code(400);
        echo json_encode(['message' => 'User ID is required']);
        exit();
    }
    
    $userId = $_POST['user_id'];

    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['avatar'];
        $allowedTypes = ['image/jpeg', 'image/png'];

        if (!in_array($file['type'], $allowedTypes)) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid file type. Only JPEG and PNG types are allowed."]);
            exit;
        }

        if ($file['size'] > 2 * 1024 * 1024) {
            http_response_code(400);
            echo json_encode(["message" => "File size exceeds the limit of 2MB."]);
            exit;
        }

        $uploadDir = './uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        // Retrieve the current avatar filename from the database
        require_once '../../vendor/autoload.php';
        require_once '../../model/Connection.php';

        $dbConnect = new DbConnect();
        $pdo = $dbConnect->connect();

        $stmt = $pdo->prepare("SELECT avatar FROM users WHERE id = :id");
        $stmt->bindParam(':id', $userId);
        $stmt->execute();
        $currentAvatar = $stmt->fetchColumn();

        // Delete the current avatar file if it exists
        if ($currentAvatar && file_exists($uploadDir . $currentAvatar)) {
            unlink($uploadDir . $currentAvatar);
        }

        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $fileName = $userId . '.' . $extension;
        $filePath = $uploadDir . $fileName;

        if (move_uploaded_file($file['tmp_name'], $filePath)) {
            $stmt = $pdo->prepare("UPDATE users SET avatar = :avatar WHERE id = :id");
            $stmt->bindParam(':avatar', $fileName);
            $stmt->bindParam(':id', $userId);

            if ($stmt->execute()) {
                $fullUrl = "http://localhost:8000/controller/profile/uploads/" . $fileName; 
                echo json_encode(["message" => "Avatar uploaded and updated successfully.", "url" => $fullUrl]);
                http_response_code(200);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Failed to update avatar in the database."]);
            }
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to move uploaded file."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "No image file uploaded or upload error."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Invalid request method."]);
}
?>
