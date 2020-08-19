<?php
session_start();
require_once("vendor/autoload.php");
use \Slim\Slim;
use \Pokedex\DB\Sql;
use \Pokedex\Model\User;

$app = new Slim();
$app->config('debug', true);

$app->get('/',function(){
    require_once("views/index.html");
});

$app->post("/register",function(){
    $user = new User();
    $json=$user->register();
    header('Content-Type: application/json');
    echo json_encode($json);
    exit;  
});
$app->post("/login",function(){
    $user = new User();
    $user->setUser($_POST['user']);
    $user->setPass($_POST['pass']);
    $result=$user->login();
    header('Content-Type: application/json');
    echo(json_encode($result));
});

$app->get("/logout",function(){
    User::logout();
    header("Location: /");
    exit;
});
$app->get("/teste",function(){
    var_dump($_SESSION['iduser']);
});

$app->get('/verifylogin',function(){
    $sql = new Sql();
    $json=User::verifyLogin();
    header('Content-Type: application/json');
    echo json_encode($json);
});



$app->run();

?>