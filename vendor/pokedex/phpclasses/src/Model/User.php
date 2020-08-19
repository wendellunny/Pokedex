<?php
    namespace Pokedex\Model;
    use \Pokedex\DB\Sql;
    class User{
        private $iduser;
        private $user;
        private $pass;

        //Gets and Sets
        public function setIdUser($value){
            $this->iduser = $value; 
        }
        public function getIdUser(){
            return $this->iduser;
        }
            
        public function setUser($value){
            $this->user = $value; 
        }
        public function getUser(){
            return $this->user;
        }
            
        public function setPass($value){
            $this->pass = $value; 
        }
        public function getPass(){
            return $this->pass;
        }
        //Register User

        public static function verifyRegister(){
            $sql = new Sql();
            $results=$sql->select("SELECT username from tb_user where username = :USER",[
                ":USER" => $_POST['user']
            ]); 
         
            if ($_POST['user']==""){
                return [
                    'status' => false,
                    'error' => 'Insira um usuário'
                ];
            }else if(isset($results["username"])){
                return [
                    'status' => false,
                    'error' => 'Nick Indisponivel'
                ];
            }else if(strlen($_POST['pass'])<8){
                return [
                    'status' => false,
                    'error' => 'Insira uma senha com pelo menos 8 caracteres'
                ];
            }else{
                return[
                    'status' =>true,
                    'error' =>''
                ];
            }
        }
        public function register(){
            $status = User::verifyRegister();
            $sql = new Sql();
            if(isset($status['status'])){
                if ($status['status']===true){
                    $securePassword = password_hash($_POST['pass'],PASSWORD_DEFAULT);
                    $sql->query("INSERT INTO tb_user (username,passwordhash) values(:USERNAME,:PASSWORDHASH)",[
                        ":USERNAME" => $_POST['user'],
                        ":PASSWORDHASH" => $securePassword
                    ]);
                    return $status;
                }else{
                    return $status;   
                }  
            }
        }
        //Login User
        public function login():array{
            $sql = new Sql();
            $results = $sql->select("SELECT * FROM tb_user WHERE username = :USERNAME",[
                ":USERNAME" => $this->getUser()
            ]); 
            if(isset($results['iduser'])){
                if($results['username']==$this->getUser() && password_verify($this->getPass(),$results['passwordhash'])){
                    $_SESSION['iduser'] = $results['iduser'];
                    return [
                        'status'=>true,
                        'error'=>""
                    ]; 
                }else{
                    session_destroy();
                    return [
                        'status'=>false,
                        'error'=>"Usuário ou Senha Incorretos"
                    ];
                }
                
            }else{
                session_destroy();
                return [
                    'status'=>false,
                    'error'=>"Usuário ou Senha Incorretos"
                ];
            }   
            
        }

        public static function logout(){
            session_unset();
            session_destroy();
        }

        public static function verifyLogin(){
            $sql = new Sql();
            
            if(isset($_SESSION['iduser'])){
                $results = $sql->select("SELECT * FROM tb_user WHERE iduser = :IDUSER",[
                    ":IDUSER" => $_SESSION['iduser']
                ]);
                return [
                    "loginOn" => true,
                    "username" => $results['username'],
                    "urlphoto" => $results['urlphoto']  
                ];
            }else{
                return [
                    "loginOn" => false
                ];
            }

        }     

    }
    



?>