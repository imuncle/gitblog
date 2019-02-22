<?php
    $code = $_GET['code'];
    $client_id = $_GET['client_id'];
    $client_secret = $_GET['cliendt_secret'];

    $url = "https://github.com/login/oauth/access_token?client_id=".$client_id."&client_secret=".$client_secret."&code=".$code;
    
    $html= file_get_contents($url);

    $data = explode("&", $html);
    $token = explode("=", $data[0]);
    echo $token;
?>