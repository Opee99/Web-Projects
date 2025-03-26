<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
    
    $to = "john.doe@example.com";
    $subject = "New Contact Form Submission";
    
    $headers = "From: " . $email . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    $email_body = "You have received a new message from your website contact form.\n\n" .
                 "Name: " . $name . "\n" .
                 "Email: " . $email . "\n" .
                 "Message:\n" . $message;
    
    mail($to, $subject, $email_body, $headers);
    
    // Return JSON response
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
    exit;
}
?>