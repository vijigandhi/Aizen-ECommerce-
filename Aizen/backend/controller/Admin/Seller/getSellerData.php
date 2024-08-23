<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

error_reporting(E_ALL);
ini_set('display_errors', 1);

require '../db_connect.php'; // Ensure this path is correct

// Get the time period filter from the request (e.g., 'last_30_days')
$time_period = $_GET['period'] ?? 'last_30_days';
$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(['error' => 'User ID is required']);
    exit;
}

// Define time range based on the selected period
switch ($time_period) {
    case 'lifetime':
        $date_condition_current = "1"; // No date condition
        $date_condition_previous = "1"; // No date condition for previous period
        break;
    case 'last_7_days':
        $date_condition_current = "created_at >= NOW() - INTERVAL 7 DAY";
        $date_condition_previous = "created_at >= NOW() - INTERVAL 14 DAY AND created_at < NOW() - INTERVAL 7 DAY";
        break;
    case 'last_30_days':
        $date_condition_current = "created_at >= NOW() - INTERVAL 30 DAY";
        $date_condition_previous = "created_at >= NOW() - INTERVAL 60 DAY AND created_at < NOW() - INTERVAL 30 DAY";
        break;
    case 'last_6_months':
        $date_condition_current = "created_at >= NOW() - INTERVAL 6 MONTH";
        $date_condition_previous = "created_at >= NOW() - INTERVAL 12 MONTH AND created_at < NOW() - INTERVAL 6 MONTH";
        break;
    case 'last_1_year':
        $date_condition_current = "created_at >= NOW() - INTERVAL 1 YEAR";
        $date_condition_previous = "created_at >= NOW() - INTERVAL 2 YEAR AND created_at < NOW() - INTERVAL 1 YEAR";
        break;
    default:
        $date_condition_current = "created_at >= NOW() - INTERVAL 30 DAY";
        $date_condition_previous = "created_at >= NOW() - INTERVAL 60 DAY AND created_at < NOW() - INTERVAL 30 DAY";
        break;
}

// Helper function to calculate percentage change
function calculatePercentageChange($current, $previous) {
    if ($previous == 0) {
        return $current > 0 ? 100 : 0;
    }
    return (($current - $previous) / $previous) * 100;
}

// Total Products Processed
$sql_products_current = "
    SELECT COUNT(*) as total
    FROM products
    WHERE seller_id = ? AND $date_condition_current
";
$stmt_products_current = $conn->prepare($sql_products_current);
$stmt_products_current->bind_param('i', $user_id);
$stmt_products_current->execute();
$result_products_current = $stmt_products_current->get_result();
$total_records_processed_current = $result_products_current->fetch_assoc()['total'];

$sql_products_previous = "
    SELECT COUNT(*) as total
    FROM products
    WHERE seller_id = ? AND $date_condition_previous
";
$stmt_products_previous = $conn->prepare($sql_products_previous);
$stmt_products_previous->bind_param('i', $user_id);
$stmt_products_previous->execute();
$result_products_previous = $stmt_products_previous->get_result();
$total_records_processed_previous = $result_products_previous->fetch_assoc()['total'];

$records_processed_change = calculatePercentageChange($total_records_processed_current, $total_records_processed_previous);

// Total Sales (Sum of the total column from orders)
$sql_orders_sum_current = "
    SELECT SUM(oi.price * oi.quantity) as total_sum
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE oi.product_id IN (
        SELECT id FROM products WHERE seller_id = ?
    ) AND $date_condition_current
";
$stmt_orders_sum_current = $conn->prepare($sql_orders_sum_current);
$stmt_orders_sum_current->bind_param('i', $user_id);
$stmt_orders_sum_current->execute();
$result_orders_sum_current = $stmt_orders_sum_current->get_result();
$total_sum_current = $result_orders_sum_current->fetch_assoc()['total_sum'] ?? 0;

$sql_orders_sum_previous = "
    SELECT SUM(oi.price * oi.quantity) as total_sum
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE oi.product_id IN (
        SELECT id FROM products WHERE seller_id = ?
    ) AND $date_condition_previous
";
$stmt_orders_sum_previous = $conn->prepare($sql_orders_sum_previous);
$stmt_orders_sum_previous->bind_param('i', $user_id);
$stmt_orders_sum_previous->execute();
$result_orders_sum_previous = $stmt_orders_sum_previous->get_result();
$total_sum_previous = $result_orders_sum_previous->fetch_assoc()['total_sum'] ?? 0;

$success_rate_change = calculatePercentageChange($total_sum_current, $total_sum_previous);

// New Orders (only orders containing products of the specified seller)
$sql_orders_count_current = "
    SELECT COUNT(DISTINCT o.id) as total
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE oi.product_id IN (
        SELECT id FROM products WHERE seller_id = ?
    ) AND $date_condition_current
";
$stmt_orders_count_current = $conn->prepare($sql_orders_count_current);
$stmt_orders_count_current->bind_param('i', $user_id);
$stmt_orders_count_current->execute();
$result_orders_count_current = $stmt_orders_count_current->get_result();
$new_orders_current = $result_orders_count_current->fetch_assoc()['total'];

$sql_orders_count_previous = "
    SELECT COUNT(DISTINCT o.id) as total
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE oi.product_id IN (
        SELECT id FROM products WHERE seller_id = ?
    ) AND $date_condition_previous
";
$stmt_orders_count_previous = $conn->prepare($sql_orders_count_previous);
$stmt_orders_count_previous->bind_param('i', $user_id);
$stmt_orders_count_previous->execute();
$result_orders_count_previous = $stmt_orders_count_previous->get_result();
$new_orders_previous = $result_orders_count_previous->fetch_assoc()['total'];

$new_orders_change = calculatePercentageChange($new_orders_current, $new_orders_previous);

// Prepare response
$response = [
    'total_records_processed' => $total_records_processed_current,
    'records_processed_change' => $records_processed_change,
    'success_rate' => $total_sum_current,
    'success_rate_change' => $success_rate_change,
    'new_orders' => $new_orders_current,
    'new_orders_change' => $new_orders_change
];

echo json_encode($response);

$conn->close();
?>
