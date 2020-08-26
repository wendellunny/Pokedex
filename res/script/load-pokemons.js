var myPokemonsList;
function getMyPokemons(){
    $.ajax({
        url:"/getmypokemons",
        type:"GET",
        dataType:"json"
    }).done(function(data){
        myPokemonsList = data;
        
    });
}

getMyPokemons();







$(function(){
    var idPrevious=0;
    var load = false;
    var loadCard = false;
    var linkRequest="https://pokeapi.co/api/v2/pokemon?offset=0&limit=25";
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

   

    function getPokemon(pokemon){
        $.ajax({
            url:pokemon.url,
            type:"GET",
            dataType:"json"
        }).done(function(data){
            
            addCard(data.forms[0].url);
        })
    }


    function requestPokemons(){
        
        $(".loading-pokemons").css("display","flex");
        
        $.ajax({
            url:linkRequest,
            type:"GET",
            dataType:"json"
            
        }).done(function(data){
            load = false;
            for(i=0;i<data.results.length;i++){
                load = false;
                getPokemon(data.results[i]);
                
                if(i+1==data.results.length){
                    $(".loading-pokemons").css("display","none");
                    load = true;
                }
            }
            linkRequest = data.next; 
        });  
    }

    requestPokemons();
    console.log(document.body.scrollHeight);

    $(document).scroll(function(){
        var heightBody = $("body").height();
        var winHeight = window.innerHeight;
        var winScroll = $(this).scrollTop();
       
        var distance = heightBody-winHeight-2;
        $(".loading-pokemons").css("display","flex"); 
        if($(this).scrollTop() >distance && load===true){
            requestPokemons();
        }

    });


    // Search
    function searchPokemon(){
        linkRequest="https://pokeapi.co/api/v2/pokemon?offset=0&limit=50";
        $(".pokemon-list").text(" ");
        $(".loading-pokemons").css("display","flex"); 
        var namePokemon = $(".search input").val();
        if(namePokemon == ""){
            requestPokemons();    
        }else{
            $.ajax({
                url:"https://pokeapi.co/api/v2/pokemon/"+namePokemon+"/",
                type:"GET",
                dataType:"json"
    
            }).done(function(data){
                addCard(data.forms[0].url);
                $(".loading-pokemons").css("display","none"); 
            })
        
        }
    }

    $(".search button").click(function(){
        searchPokemon();
    });

    $(".search input").keyup(function(e){
        if (e.keyCode == 13){
            searchPokemon();   
        }
    });

  
    

});