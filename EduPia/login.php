<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];

    // Basic validation
    if (empty($username) || empty($password)) {
        echo "Username and password are required.";
    } else {
        // In a real application, you would check the username and password
        // against a database of users.  For this example, we will just
        // print the username and password.
        echo "Login attempt with username: " . htmlspecialchars($username) . " and password: " . htmlspecialchars($password);
    }
} else {
    echo "This script only accepts POST requests.";
}
?>