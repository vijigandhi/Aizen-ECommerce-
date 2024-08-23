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

    // Fetch all products
    $sqlAllProducts = "
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
        is_active = 1
    ";
    
    $stmtAllProducts = $conn->prepare($sqlAllProducts);
    $stmtAllProducts->execute();

    $allProducts = $stmtAllProducts->fetchAll(PDO::FETCH_ASSOC);

    if ($allProducts === false) {
        throw new Exception('Error fetching products');
    }

    // Fetch popular products
    $sqlPopularProducts = "
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
        is_active = 1 AND is_popular = 1
    ";
    
    $stmtPopularProducts = $conn->prepare($sqlPopularProducts);
    $stmtPopularProducts->execute();

    $popularProducts = $stmtPopularProducts->fetchAll(PDO::FETCH_ASSOC);

    if ($popularProducts === false) {
        throw new Exception('Error fetching popular products');
    }

    $response = [
        'allProducts' => $allProducts,
        'popularProducts' => $popularProducts
    ];

    http_response_code(200);
    echo json_encode($response);

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
