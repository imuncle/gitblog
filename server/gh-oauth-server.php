<?php
    /**
     * 发送post请求
     * @param string $url 请求地址
     * @param array $post_data post键值对数据
     * @return string
     */
    function send_post($url, $post_data) {
        $postdata = http_build_query($post_data);
        $options = array(
        'http' => array(
            'method' => 'POST',
            'header' => 'Content-type:application/x-www-form-urlencoded',
            'content' => $postdata,
            'timeout' => 15 * 60 // 超时时间（单位:s）
        )
    );
        $context = stream_context_create($options);
        $result = file_get_contents($url, false, $context);
        return $result;
    }

    $code = $_GET['code'];
	$redirect_url = $_GET['redirect_url'];
    $client_id = $_GET['client_id'];
    $client_secret = $_GET['client_secret'];

    $post_data = array(
        'client_id' => $client_id,
        'client_secret' => $client_secret,
        "code" => $code
    );
    $html = send_post('https://github.com/login/oauth/access_token', $post_data);

    $data = explode("&", $html);
    $token = explode("=", $data[0]);
?>
<script>
window.location.href = "<?php echo $redirect_url; ?>"+"&access_token="+"<?php echo $token[1]; ?>";
</script>