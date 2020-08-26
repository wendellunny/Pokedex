$(function(){
    function addCard(formLink){
        $.ajax({
            url:"/getmypokemons",
            type:"GET",
            dataType:"json"
        }).done(function(data){
            myPokemonsList = data;
           
            var card;
            $.ajax({
                url:formLink,
                type:"GET",
                dataType:"json"
            }).done(function(data){
            //button add
            card='<div class="cards"><div class="img-card"><img src="'+data.sprites.front_default+'" alt=""><span>'+ data.name +'</span></div><div class="buttons-card"><button class="add" value = "'+data.id+'">ADICIONAR</button><button class="more" value="'+data.id+'">DETALHES</button></div></div>'
            
            //button remove
            for(var i = 0; i<myPokemonsList.length;i++){
                if(data.id==myPokemonsList[i].idpokemon){
                    card='<div class="cards"><div class="img-card"><img src="'+data.sprites.front_default+'" alt=""><span>'+ data.name +'</span></div><div class="buttons-card"><button class="remove" value = "'+data.id+'">REMOVER</button><button class="more" value="'+data.id+'">DETALHES</button></div></div>'
                }
                ;
            }
            document.getElementById("pokemon-list").innerHTML += card;
            load = true;
        });
        
        });
    }

    function loadMyPokemons(){
        $.ajax({
            url:"/getmypokemons",
            type:"GET",
            dataType:"json"
        }).done(function(listPokemon){
            
            $.each(listPokemon,function(indice,pokemon){
                $.ajax({
                    url: "https://pokeapi.co/api/v2/pokemon/"+pokemon.idpokemon+"/",
                    type:"GET",
                    dataType:"json"
                }).done(function(data){
                    addCard(data.forms[0].url);
                })
                
            });
            $(".loading-pokemons").css("display","none"); 
        })
    }
   
    loadMyPokemons();
    


})