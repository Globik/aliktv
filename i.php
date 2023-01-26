<?php
// username : pasword
$delans_auth = base64_encode('27604_user_1:a1!Atq6U?z');
// вот урл, который предоставляет апи  детального расчета
$base_url = "https://unf2.42clouds.com/unf_base2/33991/hs/delans-client/tarifCalc";

	$data = array(
	"urgent" => "urgent",
    "fromCity" => "Санкт-Петербург",
    "toCity" => "Москва",
    "deliveryPrice" => "300",
    "weight" => "10000",
      "height" => "1000",
      "length" => "1000",
      "width" => "1000",
      "amount" => "400",
      "sessionId" => "session-id"
);
    $session_id = 'session-id';
    
    $query = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);


$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $base_url);
curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization : Basic " . $delans_auth, "sesionId:" . $session_id ));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $query);

$resp = curl_exec($curl);
curl_close($curl);
// возвращает 400 Bad Request
echo $resp;


/*
 * 
 * backup-2023-01-24/wp-content/plugins/delans-routes/delans-routes.php
 * Вот функция, котторая отвечает за детальный подсчет. Почему она
 * возращает пустую строку?
function tarif_calc_func(WP_REST_Request $request)
{
    global $delans_auth;
    global $base_url;

    $params = $request->get_params();

    $data_calc = $params['data-calc'];
    $session_id = $params['session-id'];

    if ($data_calc['services'] == null) {
        $data_calc += array('services' => new ArrayObject());
    }

    $query = json_encode($data_calc, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);

    $args = array(
        'headers' => array(
            "Content-Type" => "application/json",
            "Authorization" => "Basic $delans_auth",
            "sessionId" => "$session_id"
        ),
        'body' => $query,
    );
    $result = wp_remote_post("$base_url/tarifCalc", $args);

    return json_decode($result['body']);
}

*/



?>
