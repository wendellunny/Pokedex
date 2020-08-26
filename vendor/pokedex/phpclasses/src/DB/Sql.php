<?php
namespace Pokedex\DB;

class Sql{
    const HOSTNAME = "127.0.0.1";
    const USERNAME = "root";
    const PASSWORD = "";
    const DBNAME = "db_pokedex";

    private $conn;
    
    public function __construct(){
        $this->conn = new \PDO (
            "mysql:host=".Sql::HOSTNAME.";dbname=".Sql::DBNAME,
            Sql::USERNAME,
            Sql::PASSWORD
        );
    }
    public function setParams($statement,$parameters = array()){
        foreach ($parameters as $key => $value) {
           $this->bindParam($statement,$key,$value);
        }
    }
    public function bindParam($statement,$key,$value){
        $statement->bindParam($key,$value);
    } 
    public function query($rawQuery,$params = array()){

        $stmt = $this->conn->prepare($rawQuery);
        $this->setParams($stmt,$params);
        $stmt->execute();
    }

    public function select($rawQuery,$params = array()):array{

        $stmt = $this->conn->prepare($rawQuery);

        $this->setParams($stmt,$params);

        $stmt -> execute();

        $results = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        if(isset($results[0]) && count($results)==1){
            return $results[0];
        }else{
            return $results;
        }
    }

}
?>