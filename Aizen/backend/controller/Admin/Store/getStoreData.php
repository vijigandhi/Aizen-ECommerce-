<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

error_reporting(E_ALL);
ini_set('display_errors', 1);

require '../db_connect.php';

// Get the store ID and time period from the request
$store_id = $_GET['store_id'] ?? '';
$time_period = $_GET['period'] ?? 'last_30_days';

// Define time range based on the selected period
switch ($time_period) {
    case 'lifetime':
        $date_condition = "1"; // No date condition
        break;
    case 'last_7_days':
        $date_condition = "o.created_at >= NOW() - INTERVAL 7 DAY";
        break;
    case 'last_30_days':
        $date_condition = "o.created_at >= NOW() - INTERVAL 30 DAY";
        break;
    case 'last_6_months':
        $date_condition = "o.created_at >= NOW() - INTERVAL 6 MONTH";
        break;
    case 'last_1_year':
        $date_condition = "o.created_at >= NOW() - INTERVAL 1 YEAR";
        break;
    default:
        $date_condition = "o.created_at >= NOW() - INTERVAL 30 DAY";
        break;
}

// Query for total products processed
$sql_products = "SELECT COUNT(p.id) as total_products
                 FROM products p
                 WHERE p.store_id = ? AND p.created_at >= NOW() - INTERVAL 30 DAY";
$stmt = $conn->prepare($sql_products);
$stmt->bind_param('i', $store_id);
$stmt->execute();
$result = $stmt->get_result();
$total_products = $result->fetch_assoc()['total_products'];

// Query for total sales
$sql_sales = "SELECT SUM(oi.price) as total_sales
              FROM orders o
              JOIN order_items oi ON o.id = oi.order_id
              WHERE oi.store_id = ? AND $date_condition";
$stmt = $conn->prepare($sql_sales);
$stmt->bind_param('i', $store_id);
$stmt->execute();
$result = $stmt->get_result();
$total_sales = $result->fetch_assoc()['total_sales'] ?? 0;

// Query for new customers
$sql_customers = "SELECT COUNT(DISTINCT u.id) as new_customers
                  FROM users u
                  JOIN products p ON u.id = p.seller_id
                  WHERE p.store_id = ? AND p.created_at >= NOW() - INTERVAL 30 DAY";
$stmt = $conn->prepare($sql_customers);
$stmt->bind_param('i', $store_id);
$stmt->execute();
$result = $stmt->get_result();
$new_customers = $result->fetch_assoc()['new_customers'];

// Query for new orders
$sql_orders = "SELECT COUNT(DISTINCT o.id) as new_orders
               FROM orders o
               JOIN order_items oi ON o.id = oi.order_id
               WHERE oi.store_id = ? AND $date_condition";
$stmt = $conn->prepare($sql_orders);
$stmt->bind_param('i', $store_id);
$stmt->execute();
$result = $stmt->get_result();
$new_orders = $result->fetch_assoc()['new_orders'];

// Prepare response
$response = [
    'total_products' => $total_products,
    'total_sales' => $total_sales,
    'new_customers' => $new_customers,
    'new_orders' => $new_orders,
];

echo json_encode($response);

$conn->close();
?>
