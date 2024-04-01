<?php

$cred = file_get_contents('credentials.json');
$db = json_decode($cred);

$pgsql_server = $db->pg_endpoint;
$pgsql_user = $db->pg_user;
$pgsql_password = $db->pg_password;
$pgsql_db = $db->pg_db;


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    	// Get time range from user
    $startTimestamp = $_POST['startTime'];
    $endTimestamp = $_POST['endTime'];
    //echo "Start Timestam2: " . $startTimestamp . "<br>";
    //echo "End Timestamp2: " . $endTimestamp . "<br>";

    try {
        // PostgreSQL connection
	    $conn = new PDO("pgsql:host=$pgsql_server;dbname=$pgsql_db", $pgsql_user, $pgsql_password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Query in time range
        $query = "SELECT longitude, latitude FROM coordinates WHERE timestamp >= :start AND timestamp <= :end";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':start', $startTimestamp, PDO::PARAM_INT);
        $stmt->bindParam(':end', $endTimestamp, PDO::PARAM_INT);
        $stmt->execute();

        // Get filtered coordinates 
        $coordenadas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Crear un objeto GeoJSON válido
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
                    // Puedes agregar más propiedades si lo deseas
                )
            );
            array_push($geojson['features'], $feature);
        }

        // Salida del GeoJSON
        header('Content-type: application/json');
        echo json_encode($geojson);

        //echo json_encode($coordenadas);

        // Show obtnaied coordinates
        //foreach ($coordenadas as $coordenada) {
            //echo "<p>Longitude: " . $coordenada['longitude'] . ", Latitude: " . $coordenada['latitude'] . "</p>";
       // }
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }

    	// Disconnect from Data Base
    $conn = null;
}
?>
