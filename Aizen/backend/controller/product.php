<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include '../model/Connection.php';

try {
    $objDb = new DbConnect();
    $conn = $objDb->connect();

    if (!$conn) {
        throw new Exception('Database connection failed');
    }

    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid product ID']);
        exit;
    }

    $sql = "
    SELECT 
        id,
        name,
        short_description,
        description,
        actual_price,
        selling_price,
        quantity,
        unit,
        category_id,
        subcategory_id,
        store_id,
        seller_id,
        created_at,
        updated_at,
        images
    FROM 
        products
    WHERE
        id = :id
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($product === false) {
        http_response_code(404);
        echo json_encode(['error' => 'Product not found']);
    } else {
        http_response_code(200);
        echo json_encode($product);
    }
} catch (PDOException $e) {
    error_log('PDOException: ' . $e->getMessage(), 0);
    http_response_code(500);
    echo json_encode(['error' => 'Database query failed']);
} catch (Exception $e) {
    error_log('Exception: ' . $e->getMessage(), 0);
    http_response_code(500);
    echo json_encode(['error' => 'Unexpected error']);
}

$conn = null;
?>
