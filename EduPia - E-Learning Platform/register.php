<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $newUsername = $_POST["newUsername"];
    $newEmail = $_POST["newEmail"];
    $newPassword = $_POST["newPassword"];

    // Basic validation
    if (empty($newUsername) || empty($newEmail) || empty($newPassword)) {
        echo "All fields are required.";
    } else {
        // In a real application, you would store the new user's information
        // in a database. For this example, we will just print the data.
        echo "Registration attempt with username: " . htmlspecialchars($newUsername) . ", email: " . htmlspecialchars($newEmail) . ", and password: " . htmlspecialchars($newPassword);
    }
} else {
    echo "This script only accepts POST requests.";
}
?>