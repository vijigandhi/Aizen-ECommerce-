<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require 'db_connect.php';

// Read the input data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input data
if (!isset($data['name']) || !isset($data['category_id'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$subCategoryName = $conn->real_escape_string($data['name']);
$categoryId = (int)$data['category_id'];

// Check if the category exists
$checkSql = "SELECT id FROM categories WHERE id = $categoryId";
$checkResult = $conn->query($checkSql);

if ($checkResult->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid category ID']);
    exit;
}

// SQL query to insert data into the subcategories table
$sql = "INSERT INTO subcategories (name, category_id) VALUES ('$subCategoryName', '$categoryId')";

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
