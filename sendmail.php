<?php
  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\Exception;

  require 'phpmailer/src/Exception.php';
  require 'phpmailer/src/PHPMailer.php';

  use PHPMailer\PHPMailer\SMTP;

  $mail = new PHPMailer(true);

  $mail->isSMTP();
  $mail->SMTPAuth = true;

  $mail->Host = "smtp.gmail.com";
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
  $mail->Port = 587;

  $mail->Username = "samuilryvkin@gmail.com";
  $mail->Password = "oi042N1748YxQ1";
  

  $mail->CharSet = 'UTF-8';
  $mail->IsHTML(true);

  $mail->setFrom('samuilryvkin@gmail.com');

  $mail->addAddress('samuilryvkin@gmail.com');

  if (trim(!empty($_POST['name']))) {
    $body.='<p><strong>Name:</strong> '.$_POST['name'].'</p>';
  }

  if (trim(!empty($_POST['phone']))) {
    $body.='<p><strong>Phone number:</strong> '.$_POST['phone'].'</p>';
  }

  if (trim(!empty($_POST['email']))) {
    $body.='<p><strong>Email:</strong> '.$_POST['email'].'</p>';
  }

  if (trim(!empty($_POST['message']))) {
    $body.='<p><strong>Message:</strong> '.$_POST['message'].'</p>';
  }

  if (!empty($_FILES['image']['tmp_name'])) {
    $filePath = __DIR__ . "/files/" . $_FILES['image']['name'];

    if (copy($_FILES['image']['tmp_name'], $filePath)) {
      $fileAttach = $filePath;
      $body.='<p><strong>Photo</strong>';
      $mail->addAttachment($fileAttach);
    }
  }

  $mail->Body = $body;

  if (!$mail->send()) {
    $message = 'Error';
  } else {
    $message = 'Data has been sent';
  }

  $response = ['message' => $message];

  header('Content-type: application/json');
  echo json_encode($response);
?>