<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

// Import PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../PHPMailer/src/Exception.php';
require '../PHPMailer/src/PHPMailer.php';
require '../PHPMailer/src/SMTP.php';

// Get form data
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$house = $_POST['subject'] ?? '';
$message = $_POST['message'] ?? '';

// Validate required fields
if (empty($name) || empty($email) || empty($phone) || empty($message)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'All fields are required. Please fill in all fields.'
    ]);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error', 
        'message' => 'Please enter a valid email address.'
    ]);
    exit;
}

try {
    // Create PHPMailer instance
    $mail = new PHPMailer(true);
    
    // Server settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'sendsaid59@gmail.com';
    $mail->Password   = 'oppj awro yaba yrbc'; // ← REPLACE WITH YOUR APP PASSWORD
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    
    // Recipients
    $mail->setFrom('sendsaid59@gmail.com', 'KASSOSA Website');
    $mail->addAddress('sendsaid59@gmail.com', 'KASSOSA Admin');
    $mail->addReplyTo($email, $name);
    
    // Content
    $mail->isHTML(true);
    $mail->Subject = "New Contact Form Submission - $house House";
    $mail->Body    = "
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Phone:</strong> $phone</p>
        <p><strong>House:</strong> $house</p>
        <p><strong>Message:</strong><br>".nl2br(htmlspecialchars($message))."</p>
        <p><em>Submitted on: ".date('Y-m-d H:i:s')."</em></p>
    ";
    
    $mail->AltBody = "
        New Contact Form Submission
        
        Name: $name
        Email: $email
        Phone: $phone
        House: $house
        
        Message:
        $message
        
        Submitted on: ".date('Y-m-d H:i:s');
    
    // Send email
    $mail->send();
    
    // Success response
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Thank you! Your message has been received. We will contact you soon.'
    ]);
    
} catch (Exception $e) {
    // Error response
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Message could not be sent. Please try again later or contact us directly.'
    ]);
    
    // Log the error (for debugging)
    error_log("PHPMailer Error: " . $mail->ErrorInfo);
}
?>