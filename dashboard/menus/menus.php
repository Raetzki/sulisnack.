<?php
include "./sql.php"; 

$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$uri = explode("/", $uri);
$bodydatas = json_decode(file_get_contents("php://input"), true);

switch (end($uri)) {

    case 'query':

        if ($method != "GET") {
            return http_response_code(405);
        }

        $requestmenusSQL = "SELECT termek.nev AS termékek, menuk.id AS id, menuk.name AS menünév, menuk.price AS ar FROM menutermek INNER JOIN termek ON termek.id = menutermek.termek_id INNER JOIN menuk ON menuk.id = menutermek.menu_id WHERE menuk.id = (SELECT MAX(id) FROM menuk)";
        $requestmenus = dataQuery($requestmenusSQL);

        if ($requestmenus) {
            echo json_encode($requestmenus);
        } else {
            return http_response_code(500);
        }
    
        break;
    
    case 'upload':
        if ($method != "POST") {
            return http_response_code(405);
        }

        if (empty($_POST["name"]) || empty($_POST["product"]) || empty($_POST["price"])) {
            echo json_encode(["Hiba" => "Hiányzó adatok!"], JSON_UNESCAPED_UNICODE);
            return http_response_code(400);
        }

        if (!isset($_FILES["image"]) || $_FILES["image"]["error"] !== UPLOAD_ERR_OK) {
            echo json_encode(["Hiba" => "Nem érkezett kép!"], JSON_UNESCAPED_UNICODE);
            return http_response_code(400);
        }

        $namematchSQL = "SELECT * FROM menuk WHERE name = ?";
        $namematch = dataQuery($namematchSQL, "s", [$_POST["name"]]);

        if (!empty($namematch)) {
            echo json_encode(["Hiba" => "Kérlek használj egy másik elnevezést a menühöz!"], JSON_UNESCAPED_UNICODE);
            return http_response_code(400);
        }

        $targetDir = "./uploads/";
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        $filename = time() . "_" . basename($_FILES["image"]["name"]); 
        $targetFile = $targetDir . $filename;

        if (!move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
            echo json_encode(["Hiba" => "Kép mentése sikertelen!"], JSON_UNESCAPED_UNICODE);
            return http_response_code(500);
        }

        $productsSQL = "SELECT id, nev FROM termek";
        $products = dataQuery($productsSQL);

        $menusSQL = "INSERT INTO menuk (name, , price, img) VALUES (?, ?, ?)";
        $menus = dataChange($menusSQL, "ssis", [
            $_POST["name"],
            $_POST["price"],
            $filename]);

        if ($menus) {
            $idSQL = "SELECT id FROM menuk WHERE name = ?";
            $id = dataQuery($idSQL, "s", [$_POST["name"]]);
            $bodydatas["menu_id"] = $id[0]["id"];
        }

        $firstproductSQL = "INSERT INTO menutermek (menu_id, termek_id) VALUES (?, ?)";
        $firstproduct = dataChange($firstproductSQL, "ii", [$bodydatas["menu_id"], $bodydatas["termek_id1"]]);

        $secondproductSQL = "INSERT INTO menutermek (menu_id, termek_id) VALUES (?, ?)";
        $secondproduct = dataChange($secondproductSQL, "ii", [$bodydatas["menu_id"], $bodydatas["termek_id2"]]);

        break;

    case 'change':
        if ($method != "PUT") {
            return http_response_code(405);
        }

        if(empty($bodydatas["id"]) || empty($bodydatas["name"]) || empty($bodydatas["product"]) || empty($bodydatas["price"])) {
            echo json_encode(["Hiba" => "Hiányzó adatok!"], JSON_UNESCAPED_UNICODE);
            return http_response_code(400);
        }

        $menusSQL = "SELECT id, name FROM menuk";
        $menus = dataQuery($menusSQL);

        $changeSQL = "UPDATE menuk SET name = ?, product = ?, price = ? WHERE id = ?";
        $change = dataChange($changeSQL, "ssii", [$bodydatas["name"], $bodydatas["product"], $bodydatas["price"], $bodydatas["id"]]);

        if ($change) {
            echo json_encode(["Sikeres módosítás!"], JSON_UNESCAPED_UNICODE);
        } else {
            return http_response_code(500);
        }

        break;

    case 'delete':
        if ($method != "DELETE") {
            return http_response_code(405);
        }

        if (empty($bodydatas["id"])) {
            echo json_encode(["Hiba" => "Hiányzó adatok!"], JSON_UNESCAPED_UNICODE);
            return http_response_code(400);
        }

        $menusSQL = "SELECT id, name FROM menuk";
        $menus = dataQuery($menusSQL);

        $deleteSQL = "DELETE FROM menuk WHERE id = ?";
        $delete = dataChange($deleteSQL, "s", [$bodydatas["id"]]);

        if ($delete) {
            echo json_encode(["Sikeres törlés!"], JSON_UNESCAPED_UNICODE);
        }
        else {
            return http_response_code(500);
        }

        break;
}

?>
