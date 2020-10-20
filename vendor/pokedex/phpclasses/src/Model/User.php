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
        
        

        public static function uploadImage($file){
            if (isset($file['name']) && $file['error'] == 0 && isset($_SESSION['iduser'])){
                $typeFile = explode("/",$file['type']);
                $typeFile = $typeFile[0];
                if($typeFile=="image"){
                    $tmpFile= $file['tmp_name'];
                    $extension = pathinfo($file['name'],PATHINFO_EXTENSION);
                    $extension = strtolower($extension);
                    if ( strstr ( '.jpg;.jpeg;.png', $extension ) ){
                        $imageName = $_SESSION['iduser'] . "." .$extension;
                        $directory = "res". DIRECTORY_SEPARATOR ."img" . DIRECTORY_SEPARATOR . "user-profile-photo" . DIRECTORY_SEPARATOR . "tmp";
                        $directoryImg = $directory . DIRECTORY_SEPARATOR . $imageName;
                        if (\move_uploaded_file($tmpFile,$directoryImg)){
                            return $directoryImg;
                        }
                    }

                }    
            }
        }

        public static function croppImage($directory){
            $newDirectory = "res". DIRECTORY_SEPARATOR ."img" . DIRECTORY_SEPARATOR . "user-profile-photo";
            if($directory != NULL && $directory != "" && isset($_SESSION['iduser'])){
                $thumbWidth = (float)$_POST['thumb-width'];
                $thumbHeight = (float)$_POST['thumb-height'];
                $croppWidth = (float)$_POST['cropp-width'];
                $croppHeight =(float) $_POST ['cropp-height'];
                $croppTop = (float)$_POST['cropp-top'];
                $croppLeft = (float)$_POST['cropp-left'];

                list($originalWidth,$originalHeight) = getimagesize($directory);

                $differenceWidth =  $originalWidth - $thumbWidth; 
                $differenceHeight =  $originalHeight - $thumbHeight; 

                $dividerWidth = $thumbWidth/100; 
                $dividerHeight = $thumbHeight/100;
                
                $percentCroppWidth = $croppWidth/$dividerWidth;
                $percentCroppHeight = $croppHeight/$dividerHeight;
                $percentCroppTop = $croppTop/$dividerHeight;
                $percentCroppLeft = $croppLeft/$dividerWidth;
                $x = $originalWidth * ($percentCroppLeft/100) ;
                $y = $originalHeight * ($percentCroppTop/100);
                $width = $originalWidth * ($percentCroppWidth/100);
                $height = $originalHeight * ($percentCroppHeight/100);

                $ext = pathinfo($directory, PATHINFO_EXTENSION);
                $ext = strtolower($ext);
                if($ext=="jpg"){
                    $img = imagecreatefromjpeg($directory);
                    $imgCropp =imagecrop($img, ['x' => $x, 'y' => $y, 'width' => $width, 'height' => $height]);
                    if($imgCropp != FALSE){
                        $newDirectory = $newDirectory.DIRECTORY_SEPARATOR.$_SESSION['iduser'].".jpg";
                        imagejpeg($imgCropp,$newDirectory);
                        imagedestroy($imgCropp); 
                        $directoryHTML = str_replace(DIRECTORY_SEPARATOR,"/",$newDirectory);
                        $sql = new Sql();
                        $sql->query("UPDATE tb_user SET urlphoto = :URLPHOTO WHERE iduser = :IDUSER",[
                            ":URLPHOTO" => $directoryHTML,
                            ":IDUSER" => $_SESSION['iduser']
                        ]);  
                    }
                    imagedestroy($img);

                }
                if($ext=="jpeg"){
                    $img = imagecreatefromjpeg($directory);
                    $imgCropp =imagecrop($img, ['x' => $x, 'y' => $y, 'width' => $width, 'height' => $height]);
                    if($imgCropp != FALSE){
                        $newDirectory = $newDirectory.DIRECTORY_SEPARATOR.$_SESSION['iduser'].".jpg";
                        imagejpeg($imgCropp,$newDirectory);
                        imagedestroy($imgCropp); 
                        $directoryHTML = str_replace(DIRECTORY_SEPARATOR,"/",$newDirectory);
                        $sql = new Sql();
                        $sql->query("UPDATE tb_user SET urlphoto = :URLPHOTO WHERE iduser = :IDUSER",[
                            ":URLPHOTO" => $directoryHTML,
                            ":IDUSER" => $_SESSION['iduser']
                        ]); 
                    }
                    imagedestroy($img);

                }
                if($ext=="png"){
                    $img = imagecreatefrompng($directory);
                    $imgCropp =imagecrop($img, ['x' => $x, 'y' => $y, 'width' => $width, 'height' => $height]);
                    if($imgCropp != FALSE){
                        $newDirectory = $newDirectory.DIRECTORY_SEPARATOR.$_SESSION['iduser'].".jpg";
                        imagejpeg($imgCropp,$newDirectory);
                        imagedestroy($imgCropp);
                        $directoryHTML = str_replace(DIRECTORY_SEPARATOR,"/",$newDirectory);
                        $sql = new Sql();
                        $sql->query("UPDATE tb_user SET urlphoto = :URLPHOTO WHERE iduser = :IDUSER",[
                            ":URLPHOTO" => $directoryHTML,
                            ":IDUSER" => $_SESSION['iduser']
                        ]);
                    }
                    imagedestroy($img);

                }

                unlink($directory);
                

            }
        }
        public static function verifyUsername($newname):bool{
            $sql = new Sql();
            $results=$sql->select("SELECT username from tb_user where username = :USER",[
                ":USER" => $newname
            ]); 
         
            if ($newname==""){
                return false;
    
            }else if(isset($results["username"])){
                return false;
            }else{
                return true;
            }
        }

        public static function changeUserName($newname):bool{
            $sql=new Sql();
            if(User::verifyUsername($newname)){
                $sql->query("UPDATE tb_user SET username = :USERNAME WHERE iduser=:IDUSER",[
                    ":USERNAME" => $newname,
                    ":IDUSER" => $_SESSION['iduser']
                ] 
                );
                return true;
            }else{
                return false;
            }
           
        }

    }
    



?>