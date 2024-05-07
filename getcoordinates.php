<?php

$cred = file_get_contents('credentials.json');
$db = json_decode($cred);

$pgsql_server = $db->pg_endpoint;
$pgsql_user = $db->pg_user;
$pgsql_password = $db->pg_password;
$pgsql_db = $db->pg_db;


if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $truck = $_POST['truck'];
    if ($truck == "2") {
        $table = "coordinates2";
    } else {
        $table = "coordinates";
    }


    try {
 
	    $conn = new PDO("pgsql:host=$pgsql_server;dbname=$pgsql_db", $pgsql_user, $pgsql_password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

 
        $query = "SELECT longitude, latitude, altitude, date, timestamp, car_data FROM :truck ORDER BY timestamp DESC LIMIT 1";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':truck', $table, PDO::PARAM_INT);
        $stmt->execute();


        $coordenadas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($coordenadas) {
            echo json_encode($coordenadas);
        } else {
            echo "No se encontraron coordenadas en la base de datos PostgreSQL.";
        }

    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
    $conn = null;
}
?>
