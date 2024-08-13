<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require 'db_connect.php';

// Read the input data
$data = $_POST; // Since we are using FormData, not JSON

// Validate input data
$requiredFields = ['name', 'short_description', 'description', 'actual_price', 'selling_price', 'quantity', 'unit', 'category_id', 'subcategory_id', 'store_id', 'seller_id'];

foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
        exit;
    }
}

// Extract data
$name = $conn->real_escape_string($data['name']);
$short_description = $conn->real_escape_string($data['short_description']);
$description = $conn->real_escape_string($data['description']);
$actual_price = $conn->real_escape_string($data['actual_price']);
$selling_price = $conn->real_escape_string($data['selling_price']);
$quantity = $conn->real_escape_string($data['quantity']);
$unit = $conn->real_escape_string($data['unit']);
$category_id = $conn->real_escape_string($data['category_id']);
$subcategory_id = $conn->real_escape_string($data['subcategory_id']);
$store_id = $conn->real_escape_string($data['store_id']);
$seller_id = $conn->real_escape_string($data['seller_id']);

// Handle file upload
$imageName = null; // Initialize file name

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $imageTmpName = $_FILES['image']['tmp_name'];
    $imageName = basename($_FILES['image']['name']);
    $uploadDir = '../../assets/images/'; // Ensure this directory exists and is writable
    $uploadFile = $uploadDir . $imageName;

    if (move_uploaded_file($imageTmpName, $uploadFile)) {
        // Success, $imageName contains the file name
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to upload image']);
        exit;
    }
}

// SQL query to insert data into the products table
$sql = "INSERT INTO products (name, short_description, description, actual_price, selling_price, quantity, unit, category_id, subcategory_id, store_id, images, seller_id) 
        VALUES ('$name', '$short_description', '$description', '$actual_price', '$selling_price', '$quantity', '$unit', '$category_id', '$subcategory_id', '$store_id', '$imageName', '$seller_id')";

try {
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Product added successfully']);
    } else {
        throw new mysqli_sql_exception("Error: " . $sql . "<br>" . $conn->error);
    }
} catch (mysqli_sql_exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$conn->close();
?>
