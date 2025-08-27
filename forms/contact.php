<?php
// Replace contact@example.com with your real receiving email address
$receiving_email_address = 'kassosainvestmentpartnersclub@gmail.com';

if (file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php')) {
    include($php_email_form);
} else {
    // Fallback to our custom email handling if the library is not available
    handleContactForm();
    exit;
}

// Use the PHP Email Form library if available
$contact = new PHP_Email_Form;
$contact->ajax = true;

$contact->to = $receiving_email_address;
$contact->from_name = $_POST['name'];
$contact->from_email = $_POST['email'];
$contact->subject = 'KASSOSA Contact Form: ' . (isset($_POST['subject']) ? $_POST['subject'] : 'New Message');

// Uncomment below code if you want to use SMTP to send emails. You need to enter your correct SMTP credentials
/*
$contact->smtp = array(
    'host' => 'example.com',
    'username' => 'example',
    'password' => 'pass',
    'port' => '587'
);
*/

$contact->add_message($_POST['name'], 'From');
$contact->add_message($_POST['email'], 'Email');
isset($_POST['phone']) && $contact->add_message($_POST['phone'], 'Phone');
isset($_POST['subject']) && $contact->add_message($_POST['subject'], 'House');
$contact->add_message($_POST['message'], 'Message', 10);

echo $contact->send();

// Custom email handling function as fallback
function handleContactForm() {
    // Only process POST requests
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Get the form fields and sanitize them
        $name = strip_tags(trim($_POST["name"]));
        $name = str_replace(array("\r","\n"),array(" "," "),$name);
        $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
        $phone = isset($_POST["phone"]) ? trim($_POST["phone"]) : '';
        $house = isset($_POST["subject"]) ? trim($_POST["subject"]) : '';
        $message = trim($_POST["message"]);
        
        // Check that data was sent to the script
        if (empty($name) OR empty($message) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            // Set a 400 (bad request) response code and exit
            http_response_code(400);
            echo "Please complete the form and try again.";
            exit;
        }
        
        // Set the recipient email address
        $recipient = "kassosainvestmentpartnersclub@gmail.com";
        
        // Set the email subject
        $subject = "New contact from $name - KASSOSA Website";
        
        // Build the email content
        $email_content = "Name: $name\n";
        $email_content .= "Email: $email\n";
        $email_content .= "Phone: $phone\n";
        $email_content .= "House: $house\n\n";
        $email_content .= "Message:\n$message\n";
        
        // Build the email headers
        $email_headers = "From: $name <$email>\r\n";
        $email_headers .= "Reply-To: $email\r\n";
        $email_headers .= "X-Mailer: PHP/" . phpversion();
        
        // Send the email
        if (mail($recipient, $subject, $email_content, $email_headers)) {
            // Set a 200 (okay) response code
            http_response_code(200);
            echo "Thank You! Your message has been sent.";
        } else {
            // Set a 500 (internal server error) response code
            http_response_code(500);
            echo "Oops! Something went wrong and we couldn't send your message.";
        }
        
    } else {
        // Not a POST request, set a 403 (forbidden) response code
        http_response_code(403);
        echo "There was a problem with your submission, please try again.";
    }
}
?>