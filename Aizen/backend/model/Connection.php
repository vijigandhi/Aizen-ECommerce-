<?php
class DbConnect {
    private $host = "localhost";
    private $db = "Aizen";
    private $user = "dckap";
    private $password = "Dckap2023Ecommerce";

    public function connect() {
        try {
            $conn = new PDO('mysql:host=' . $this->host . ';dbname=' . $this->db, $this->user, $this->password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
            return null;
        }
        return $conn;
    }
}

