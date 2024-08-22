<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

error_reporting(E_ALL);
ini_set('display_errors', 1);

require '../db_connect.php'; // Ensure this path is correct

// Get the time period filter from the request
$time_period = $_GET['period'] ?? 'last_30_days';
$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(['error' => 'User ID is required']);
    exit;
}

// Define time range based on the selected period
$start_date = '';
$end_date = '';
switch ($time_period) {
    case 'lifetime':
        $start_date = '0000-01-01';
        $end_date = date('Y-m-d');
        break;
    case 'last_7_days':
        $start_date = date('Y-m-d', strtotime('-7 days'));
        $end_date = date('Y-m-d');
        break;
    case 'last_30_days':
        $start_date = date('Y-m-d', strtotime('-30 days'));
        $end_date = date('Y-m-d');
        break;
    case 'last_6_months':
        $start_date = date('Y-m-01', strtotime('-6 months'));
        $end_date = date('Y-m-d');
        break;
    case 'last_1_year':
        $start_date = date('Y-m-01', strtotime('-1 year'));
        $end_date = date('Y-m-d');
        break;
    default:
        $start_date = date('Y-m-d', strtotime('-30 days'));
        $end_date = date('Y-m-d');
        break;
}

// Prepare SQL statements
$sql_products = "
    SELECT 
        DATE_FORMAT(p.created_at, '%Y-%m') as month,
        COUNT(p.id) as total_products
    FROM products p
    WHERE p.seller_id = ? AND p.created_at BETWEEN ? AND ?
    GROUP BY month
    ORDER BY month;
";

$sql_orders = "
    SELECT 
        DATE_FORMAT(o.created_at, '%Y-%m') as month,
        COUNT(oi.id) as total_orders,
        SUM(oi.price * oi.quantity) as total_sales
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.created_at BETWEEN ? AND ?
    GROUP BY month
    ORDER BY month;
";

// Prepare and execute SQL statements
$stmt_products = $conn->prepare($sql_products);
$stmt_products->bind_param('iss', $user_id, $start_date, $end_date);
$stmt_products->execute();
$products_result = $stmt_products->get_result();

$stmt_orders = $conn->prepare($sql_orders);
$stmt_orders->bind_param('ss', $start_date, $end_date);
$stmt_orders->execute();
$orders_result = $stmt_orders->get_result();

// Initialize data array
$data = [
    'labels' => [],
    'products' => [],
    'orders' => [],
    'sales' => []
];

// Fetch product data
while ($row = $products_result->fetch_assoc()) {
    $data['labels'][] = $row['month'];
    $data['products'][] = (int)$row['total_products'];
}

// Fetch order data
while ($row = $orders_result->fetch_assoc()) {
    $data['orders'][] = (int)$row['total_orders'];
    $data['sales'][] = (float)$row['total_sales'];
}

// Ensure consistent labels
$labels = array_unique(array_merge($data['labels'], $data['labels']));
$data['labels'] = array_values($labels);

foreach ($data['labels'] as $label) {
    if (!in_array($label, $data['labels'])) {
        $data['products'][] = 0;
        $data['orders'][] = 0;
        $data['sales'][] = 0;
    } else {
        $data['products'][] = $data['products'][array_search($label, $data['labels'])] ?? 0;
        $data['orders'][] = $data['orders'][array_search($label, $data['labels'])] ?? 0;
        $data['sales'][] = $data['sales'][array_search($label, $data['labels'])] ?? 0;
    }
}

echo json_encode($data);

$conn->close();
?>
