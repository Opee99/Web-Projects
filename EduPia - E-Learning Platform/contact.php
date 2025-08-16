<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $subject = $_POST["subject"];
    $message = $_POST["message"];

    // Basic validation
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        echo "All fields are required.";
    } else {
        // In a real application, you would send the message via email
        // or store it in a database. For this example, we will just
        // print the data.
        echo "Contact form submission with name: " . htmlspecialchars($name) . ", email: " . htmlspecialchars($email) . ", subject: " . htmlspecialchars($subject) . ", and message: " . htmlspecialchars($message);
    }
} else {
    echo "This script only accepts POST requests.";
}
?>