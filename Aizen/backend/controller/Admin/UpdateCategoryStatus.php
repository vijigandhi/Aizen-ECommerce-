<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db_connect.php'; // Ensure this is the path to your DB connection script

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['category_id']) && (isset($data['is_active']) || isset($data['is_popular']))) {
    $category_id = $data['category_id'];
    $is_active = isset($data['is_active']) ? $data['is_active'] : null;
    $is_popular = isset($data['is_popular']) ? $data['is_popular'] : null;

    $updates = [];
    if ($is_active !== null) {
        $updates[] = 'is_active = :is_active';
    }
    if ($is_popular !== null) {
        $updates[] = 'is_popular = :is_popular';
    }
    
    $updateString = implode(', ', $updates);
    
    $stmt = $pdo->prepare("UPDATE categories SET $updateString WHERE id = :category_id");
    
    $params = [':category_id' => $category_id];
    if ($is_active !== null) {
        $params[':is_active'] = $is_active;
    }
    if ($is_popular !== null) {
        $params[':is_popular'] = $is_popular;
    }
    
    $stmt->execute($params);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No changes made or category not found']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
}
?>

