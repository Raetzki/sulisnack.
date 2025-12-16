<?php
include "./sql.php"; 

$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$uri = explode("/", $uri);
$bodydatas = json_decode(file_get_contents("php://input"), true);

switch (end($uri)) {

    case 'login':
        if ($method !== "POST") {
            return http_response_code(405);
        }

        if (empty($bodydatas["email"]) || empty($bodydatas["pwd"])) {
            http_response_code(400);
            echo json_encode(["error" => "Kérlek, töltsd ki az összes mezőt!"], JSON_UNESCAPED_UNICODE);
            return;
        }

        $queryemailSQL = "SELECT * FROM felhasznalo WHERE email = ?";
        $queryemail = dataQuery($queryemailSQL, "s", [$bodydatas["email"]]);

        if (empty($queryemail)) {
            http_response_code(400);
            echo json_encode(["error" => "Hibás email!"], JSON_UNESCAPED_UNICODE);
            return;
        }

        $user = $queryemail[0];

        if (!password_verify($bodydatas["pwd"], $user["pwd"])) {
            http_response_code(401);
            echo json_encode(["error" => "Hibás jelszó!"], JSON_UNESCAPED_UNICODE);
            return;
        }

        http_response_code(200);
        echo json_encode([
            "success" => "Sikeres bejelentkezés!",
            "name"    => $user["name"],
            "email"   => $user["email"],
            "class"   => $user["class"],
            "role"    => $user["role"]
        ], JSON_UNESCAPED_UNICODE); 

        return;

        break;
}
?>
