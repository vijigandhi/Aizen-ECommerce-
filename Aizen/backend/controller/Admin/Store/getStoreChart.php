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

// Prepare the SQL query based on whether a store is selected
if ($store_id) {
    $store_condition = "oi.store_id = ?";
} else {
    $store_condition = "1"; // No filter for store_id
}

// Query for chart data
$sql_chart = "SELECT DATE_FORMAT(o.created_at, '%Y-%m-%d') as date,
                     SUM(oi.quantity) as products,
                     COUNT(DISTINCT o.id) as orders
              FROM orders o
              JOIN order_items oi ON o.id = oi.order_id
              WHERE $store_condition AND $date_condition
              GROUP BY DATE_FORMAT(o.created_at, '%Y-%m-%d')";

$stmt = $conn->prepare($sql_chart);
if ($store_id) {
    $stmt->bind_param('i', $store_id);
}
$stmt->execute();
$result = $stmt->get_result();

$chartData = ['labels' => [], 'products' => [], 'orders' => []];
while ($row = $result->fetch_assoc()) {
    $chartData['labels'][] = $row['date'];
    $chartData['products'][] = (int) $row['products'];
    $chartData['orders'][] = (int) $row['orders'];
}

// Prepare response
$response = [
    'labels' => $chartData['labels'],
    'products' => $chartData['products'],
    'orders' => $chartData['orders']
];

echo json_encode($response);

$conn->close();
?>
