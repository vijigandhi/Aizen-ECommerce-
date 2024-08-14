<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require 'db_connect.php';

// Check if form data is submitted via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate input data
    if (!isset($_POST['name']) || !isset($_POST['description'])) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }

    $categoryName = $conn->real_escape_string($_POST['name']);
    $categoryDescription = $conn->real_escape_string($_POST['description']);
    $imageName = null;

    // Handle file upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $imageTmpName = $_FILES['image']['tmp_name'];
        $imageName = basename($_FILES['image']['name']);
        $uploadDir = '../../assets/images/';
        $uploadFile = $uploadDir . $imageName;

        if (move_uploaded_file($imageTmpName, $uploadFile)) {
            
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to upload image']);
            exit;
        }
    }

    
    $sql = "INSERT INTO categories (name, description, image) VALUES ('$categoryName', '$categoryDescription', '$imageName')";

    try {
        if ($conn->query($sql) === TRUE) {
            echo json_encode(['success' => true, 'message' => 'Category added successfully']);
        } else {
            throw new mysqli_sql_exception("Error: " . $sql . "<br>" . $conn->error);
        }
    } catch (mysqli_sql_exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

$conn->close();
?>
