<?php
// Set error reporting for debugging (Remove in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require './PHPMailer7/src/Exception.php';
require './PHPMailer7/src/PHPMailer.php';
require './PHPMailer7/src/SMTP.php'; // Required for SMTP


// Check if the form was submitted via POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 1. Collect and Sanitize Form Data
    // Note: Your HTML uses placeholder="" for name, email, and message inputs 
    // but relies on their 'type' attribute. It's best practice to use 
    // the 'name' attribute for form fields (e.g., name="full_name").
    // I will assume the order corresponds to the fields in your form:
    $full_name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_SPECIAL_CHARS);
    $email_address = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    $user_message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_SPECIAL_CHARS);

    print_r([$full_name, $email_address, $user_message]);
    // Basic validation
    if (empty($full_name) || !$email_address || empty($user_message)) {
        // Handle error: redirect or show a message
        die("Error: Please fill in all fields correctly.");
    }

    // 2. Include PHPMailer files
    // You may need to adjust these paths based on how you installed PHPMailer

    // 3. Configure and Send Email
    $mail = new PHPMailer(true); // Passing true enables exceptions

    try {
        // Server settings (Use your SMTP Credentials here)
        // -------------------------------------------------
        $mail->isSMTP();                                            // Send using SMTP
        $mail->Host = 'smtp.hostinger.com';                 // Set the SMTP server to send through
        $mail->SMTPAuth = true;                                   // Enable SMTP authentication
        $mail->Username = 'info@sycamorenest.com';                   // SMTP username
        $mail->Password = 't$5OT9tW';                   // SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            // Enable implicit TLS encryption ('SMTPS' uses port 465)
        // OR: $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Use 'STARTTLS' for port 587
        $mail->Port = 465;                                    // TCP port to connect to

        // Recipients
        $mail->setFrom('info@sycamorenest.com', 'Sycamorenest'); // Sender email/name
        $mail->addAddress('info@sycamorenest.com', 'Sycamorenest'); // Add a recipient (Where the email goes)
        $mail->addBCC($email_address); //back to the sender 
        $mail->addBCC('meetdaniels@gmail.com'); //send to the admin 
        $mail->addReplyTo($email_address, $full_name); // Set reply-to to the user's email

        // Content
        $mail->isHTML(true); // Set email format to HTML
        $mail->Subject = 'New Contact Form Submission from ' . $full_name;

        $body = "
            <h2>Contact Form Submission</h2>
            <p><strong>Name:</strong> {$full_name}</p>
            <p><strong>Email:</strong> {$email_address}</p>
            <p><strong>Message:</strong></p>
            <p>{$user_message}</p>
        ";

        $mail->Body = $body;
        $mail->AltBody = "Name: {$full_name}\nEmail: {$email_address}\nMessage: {$user_message}"; // Plain text alternative

        $mail->send();
        // Redirect upon successful send
        header('Location: thank_you.html');
        exit;

    } catch (Exception $e) {
        // Log the error and show a user-friendly message
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        // In a real application, you might log $e->getMessage() instead of echoing it
    }

} else {
    // Not a POST request
    header('Location: /'); // Redirect back to homepage
    exit;
}
?>