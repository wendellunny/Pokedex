<?php
session_start();
require_once("vendor/autoload.php");
use \Slim\Slim;
use \Pokedex\DB\Sql;
use \Pokedex\Model\User;
use \Pokedex\Model\Pokemon;

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


$app->get('/pokemon-list',function(){
    $verify = User::VerifyLogin();
    if($verify['loginOn']==true){
        require_once("views/pokemon-list.html");
    }else{
        header("Location: /");
        exit;
    }
   
});
$app->get('/my-pokemons',function(){
    $verify = User::VerifyLogin();
    if($verify['loginOn']==true){
        require_once("views/my-pokemons.html");
    }else{
        header("Location: /");
        exit;
    }
    
});
$app->get('/profile',function(){
    $verify = User::VerifyLogin();
    if($verify['loginOn']===true){
        require_once("views/profile.html");
    }else{
        header("Location: /");
        exit;
    }
    
});


$app->get("/addpokemon/:idpokemon",function($idpokemon){
    $verifyLogin = User::VerifyLogin();
    if($verifyLogin['loginOn']===true){
        $pokemon = new Pokemon();
        $pokemon->setIdPokemon($idpokemon);
        $pokemon->setIdUser($_SESSION['iduser']);
        $verifyPokemon= $pokemon->verifyPokemonAdd();
        if((bool)$verifyPokemon===false){
            $pokemon->addPokemon();
        }
       
    }
    
});
$app->get("/deletepokemon/:idpokemon",function($idpokemon){
    $verifyLogin = User::VerifyLogin();
    if($verifyLogin['loginOn']===true){
        $pokemon = new Pokemon();
        $pokemon->setIdPokemon($idpokemon);
        $pokemon->setIdUser($_SESSION['iduser']);
        $verifyPokemon= $pokemon->verifyPokemonAdd();
        $pokemon->deletePokemon();
        
       
    }
    
});

$app->get("/getmypokemons",function(){
    $verifyLogin = User::VerifyLogin();
    if($verifyLogin['loginOn']===true){
        $pokemon= new Pokemon();
        $pokemonList = $pokemon->getmypokemons();
        header('Content-Type: application/json');
        echo json_encode($pokemonList);
    } 
});

$app->post("/user/changeimage",function(){
    header('Content-Type: application/json');
    
    // $ex = pathinfo($_FILES['select-image']['name'],PATHINFO_EXTENSION);
    
    
    //  echo json_encode($ex);
    $directoryImg = User::uploadImage($_FILES['select-image']);
    User::croppImage($directoryImg);
    //  echo json_encode( getimagesize("res".DIRECTORY_SEPARATOR."img".DIRECTORY_SEPARATOR."user-profile-photo".DIRECTORY_SEPARATOR."tmp".DIRECTORY_SEPARATOR."8.jpg") );
    
});

$app->post("/user/changeusername",function(){
    $status['status'] = User::changeUserName($_POST['input-username-edit']);  
    header('Content-Type: application/json');
    echo json_encode($status); 
});





$app->run();

?>