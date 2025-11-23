<?php
include "./products/sql.php";
$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$uri = explode("/", $uri);
$bodyData = json_decode(file_get_contents("php://input"), true);


switch (end($uri)) {
    case 'termekek':
        if($method != "GET"){
            return http_response_code(405);
        }

        if(!empty($_GET["kategoria"]) && empty($_GET["min"]) && empty($_GET["max"])){
            $kat_alapjan_SQL= "SELECT nev, leiras, foto, ar FROM termek WHERE kategoria = ?";
            $kat_alapjan = lekeres($kat_alapjan_SQL, "s", [$_GET["kategoria"]]);

            if(!empty($kat_alapjan)){
                echo json_encode($kat_alapjan);
            }
            else{
                http_response_code(400);
                echo json_encode(["valasz" => "A keresési feltételekhez nincs találat."]);
                return;
            }
        }
        else if(empty($_GET["kategoria"]) && !empty($_GET["min"]) && !empty($_GET["max"])){
            $ar_alapjan_SQL= "SELECT nev, leiras, foto, ar FROM termek WHERE ar BETWEEN ? AND ? ";
            $ar_alapjan = lekeres($ar_alapjan_SQL, "ii", [$_GET["min"], $_GET["max"]]);

            if(!empty($ar_alapjan)){
                echo json_encode($ar_alapjan);
            }
            else{
                http_response_code(400);
                echo json_encode(["valasz" => "A keresési feltételekhez nincs találat."]);
                return;
            }
        }
        else if(!empty($_GET["kategoria"]) && !empty($_GET["min"]) && !empty($_GET["max"])){
            $ar_kat_alapjan_SQL = "SELECT nev, leiras, foto, ar FROM termek WHERE kategoria = ? AND ar BETWEEN ? AND ?";
            $ar_kat_alapjan = lekeres($ar_alapjan_SQL, "sii", [$_GET["kategoria"], $_GET["min"], $_GET["max"]]);

            if(!empty($ar_kat_alapjan)){
                echo json_encode($ar_kat_alapjan);
            }
            else{
                http_response_code(400);
                echo json_encode(["valasz" => "A keresési feltételekhez nincs találat."]);
                return;
            }
        }
        else{
            http_response_code(400);
            echo json_encode(["valasz" => "Az alábbi módszerrel kereshet:\n
            1: Csak kategória alapján \n
            2: Csak ár-tartomány alapján \n
            3: Ár és kategória alapján "]);
        }
        







    break;
    
    default:
        echo json_encode("default");
        break;
}

?>