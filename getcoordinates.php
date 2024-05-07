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

        $pgsql_connection = new PDO("pgsql:host=$pgsql_server;dbname=$pgsql_db", $pgsql_user, $pgsql_password);
        $pgsql_connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $pgsql_query = "SELECT longitude, latitude, altitude, date, timestamp, car_data FROM $table ORDER BY timestamp DESC LIMIT 1";
        $pgsql_statement = $pgsql_connection->query($pgsql_query);
        $row = $pgsql_statement->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            echo json_encode($row);
        } else {
            echo "No se encontraron coordenadas en la base de datos PostgreSQL.";
        }

    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();

    } finally {
        $pgsql_connection = null;
    }
}
?>
