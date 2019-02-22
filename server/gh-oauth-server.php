<?php
    $code = $_GET['code'];
	$redirect_url = $_GET['redirect_url'];
    $client_id = $_GET['client_id'];
    $client_secret = $_GET['client_secret'];

    $url = "https://github.com/login/oauth/access_token?client_id=".$client_id."&client_secret=".$client_secret."&code=".$code;
    
    $html= file_get_contents($url);

    $data = explode("&", $html);
    $token = explode("=", $data[0]);
?>
<script>
window.location.href = "<?php echo $redirect_url; ?>"+"&access_token="+"<?php echo $token[1]; ?>";
</script>