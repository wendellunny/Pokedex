<?php
    namespace Pokedex\Model;
    use \Pokedex\DB\Sql;

    class Pokemon {
        private $idPokemon;
        private $idUser;

        public function getIdPokemon(){
            return $this->idPokemon;
        }

        public function getIdUser(){
            return $this->idUser;
        }

        public function setIdPokemon($id){
            $this->idPokemon = $id;
        }

        public function setIdUser($id){
            $this->idUser = $id;
        }

        public function addPokemon(){
            $sql=new Sql();
            $sql->query("INSERT INTO tb_pokemonuser (iduser,idpokemon) VALUES (:IDUSER,:IDPOKEMON)",[
                ":IDUSER" => $this->getIdUser(),
                ":IDPOKEMON" => $this->getIdPokemon()
            ]);
        }
        public function deletePokemon(){
            $sql=new Sql();
            $sql->query("DELETE FROM tb_pokemonuser WHERE iduser=:IDUSER && idpokemon=:IDPOKEMON ",[
                ":IDUSER" => $this->getIdUser(),
                ":IDPOKEMON" => $this->getIdPokemon()
            ]);
        }

        public function verifyPokemonAdd():bool{
            $sql = new Sql();
            $results = $sql->select("SELECT * FROM tb_pokemonuser WHERE iduser = :IDUSER && idpokemon=:IDPOKEMON",[
                ':IDUSER' => $this->getIdUser(),
                ':IDPOKEMON' => $this->getIdPokemon()
            ]
            );
            if (count($results)==0){
                return false;
            }else{
                return true;
            }
        }


        public function getMyPokemons(){
            $sql = new Sql();
            $results=$sql->select("SELECT idpokemon FROM tb_pokemonuser WHERE iduser=:IDUSER ORDER BY idpokemonuser DESC",[
                ':IDUSER' => $_SESSION['iduser']
            ]);
            if (count($results)==1){
                $result = [$results];
                return $result ;
            }else{
                return $results;
            }
            
        }

    }


?>