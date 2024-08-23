<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require 'db_connect.php';

$data = $_POST;

if (!isset($data['name']) || !isset($data['category_id']) || !isset($data['description'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$subCategoryName = $conn->real_escape_string($data['name']);
$categoryId = (int)$data['category_id'];
$description = $conn->real_escape_string($data['description']);

$imageName = null;

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $imageTmpName = $_FILES['image']['tmp_name'];
    $imageName = basename($_FILES['image']['name']);
    $uploadDir = '../../assets/images/';
    $uploadFile = $uploadDir . $imageName;

    if (!move_uploaded_file($imageTmpName, $uploadFile)) {
        echo json_encode(['success' => false, 'message' => 'Failed to upload image']);
        exit;
    }
}

$imagesJson = $imageName ? json_encode([$imageName]) : '[]';

$sql = "INSERT INTO subcategories (name, description, category_id, images) VALUES ('$subCategoryName', '$description', $categoryId, '$imagesJson')";

try {
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Subcategory added successfully']);
    } else {
        throw new mysqli_sql_exception("Error: " . $sql . "<br>" . $conn->error);
    }
} catch (mysqli_sql_exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$conn->close();
?>
