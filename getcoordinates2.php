<?php

$cred = file_get_contents('credentials.json');
$db = json_decode($cred);

$pgsql_server = $db->pg_endpoint;
$pgsql_user = $db->pg_user;
$pgsql_password = $db->pg_password;
$pgsql_db = $db->pg_db;


if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $startTimestamp = $_POST['startTime'];
    $endTimestamp = $_POST['endTime'];
    $truck = $_POST['truck'];
    if ($truck == "2") {
        $table = "coordinates2";
    } else {
        $table = "coordinates";
    }


    try {
 
	    $conn = new PDO("pgsql:host=$pgsql_server;dbname=$pgsql_db", $pgsql_user, $pgsql_password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

 
        $query = "SELECT longitude, latitude FROM $table WHERE timestamp >= :start AND timestamp <= :end";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':start', $startTimestamp, PDO::PARAM_INT);
        $stmt->bindParam(':end', $endTimestamp, PDO::PARAM_INT);
        $stmt->execute();

 
        $coordenadas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        

        $geojson = array(
            'type' => 'FeatureCollection',
            'features' => array()
        );

        foreach ($coordenadas as $coordenada) {
            $feature = array(
                'type' => 'Feature',
                'geometry' => array(
                    'type' => 'Point',
                    'coordinates' => array(floatval($coordenada['longitude']), floatval($coordenada['latitude']))
                ),
                'properties' => array(

                )
            );
            array_push($geojson['features'], $feature);
        }


        header('Content-type: application/json');
        echo json_encode($geojson);

    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }


    $conn = null;
}
?>
