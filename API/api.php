<?php
$action = $_GET['action'];

$servername = "localhost";
$username = "id15006669_evgrg";
$password = "f0dwwJJdK&HvDdqy";
$dbname = "id15006669_bd";

$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
      die("Connection failed: " . mysqli_connect_error());
}

if($action == 'saveUser'){
    
    if(!$_GET['firstName']) exit('{"result": false}');
    if(!$_GET['lastName']) exit('{"result": false}');
    if(!$_GET['middleName']) exit('{"result": false}');
    if(!$_GET['phone']) exit('{"result": false}');
    if(!$_GET['text'] && strlen($_GET['text']) > 300) exit('{"result": false}');
    
    $fistName = $_GET['firstName'];
    $lastName = $_GET['lastName'];
    $middleName = $_GET['middleName'];
    $phone = $_GET['phone'];
    $text = $_GET['text'];
    $date = date('l jS \of F Y h:i:s A');
    
$sql = "INSERT INTO users (firstName, lastName, middleName, phone, text, time) VALUES ('$fistName', '$lastName', '$middleName', '$phone', '$text', '$date')";
if (mysqli_query($conn, $sql)) {
      echo '
      {
      "result": true,
      "action": "saveUser",
      "data":  {
      "firstName": "'.$_GET['firstName'].'",
      "lastName": "'.$_GET['lastName'].'",
      "middleName": "'.$_GET['middleName'].'",
      "phone": "'.$_GET['phone'].'",
      "text": "'.$_GET['text'].'",
      "time": "'.$date.'"
      }
      }';
} else {
      echo '
      {
      "result": false,
      "action": "saveUser",
      "error": "'.mysqli_error($conn).'"}';
}
mysqli_close($conn);
}

if($action == 'getAll'){
    $sql = "SELECT * FROM users";
    $result = $conn->query($sql);
    
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    echo json_encode($rows);
}
?>
