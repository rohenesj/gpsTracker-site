<?php

$cred = file_get_contents('credentials.json');
$db = json_decode($cred);


$pgsql_server = $db->pg_endpoint;
$pgsql_user = $db->pg_user;
$pgsql_password = $db->pg_password;
$pgsql_db = $db->pg_db;

try {

    $pgsql_connection = new PDO("pgsql:host=$pgsql_server;dbname=$pgsql_db", $pgsql_user, $pgsql_password);
    $pgsql_connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pgsql_query = "SELECT longitude, latitude FROM coordinates ORDER BY timestamp DESC LIMIT 1";
    $pgsql_statement = $pgsql_connection->query($pgsql_query);
    $rows = $pgsql_statement->fetchAll(PDO::FETCH_ASSOC);

    if ($rows) {
        // Inicializar un array para almacenar las características (features)
        $geojson = array(
            'type' => 'FeatureCollection',
            'features' => array()
        );

        // Iterar sobre las filas y crear un array de características GeoJSON
        foreach ($rows as $row) {
            $feature = array(
                'type' => 'Feature',
                'geometry' => array(
                    'type' => 'Point',
                    'coordinates' => array(floatval($row['longitude']), floatval($row['latitude']))
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


    } else {
        echo "No se encontraron coordenadas en la base de datos PostgreSQL.";
    }

} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();

} finally {
    $pgsql_connection = null;
}

?>
