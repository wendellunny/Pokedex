var userData;




$(function(){
    $.ajax({
        url:"/verifylogin",
        type:"GET",
        dataType:"json"
    }).done(function(data){
        $(".menu-username p").text(data.username);
        $(".img-user-menu-mobile p").text(data.username); 
    });

   

    

    function loadImageDetails(formLink){
        $.ajax({
            url:formLink,
            type:"GET",
            dataType:"json"
        }).done(function(data){
            $(".modal-pokemon-img img").attr("src",data.sprites.front_default);
            $(".modal-pokemon-bg").css("display","flex"); 
            
        })
    }
    function openModalPokemon(){
        $(".modal-pokemon-bg").css("display","flex");
    }


    function closeModalPokemon(){
        $(".modal-pokemon-bg").css("display","none");
    }
           

    function showHideOptions(){
        if($(".options-user-bg").hasClass("options-user-animate")){
            $(".options-user-bg").css("display","block");
            $(".options-user-bg").removeClass("options-user-animate");
            
        }else{
         
            $(".options-user-bg").css("display","block");
            $(".options-user-bg").addClass("options-user-animate");
            setTimeout(function(){
                $(".options-user-bg").css("display","none");   
            },400);

        }
        
    }

    $(document).on("click",".more",function(){
        var idPokemon = $(this).val();
        var linkRequest = "https://pokeapi.co/api/v2/pokemon/"+idPokemon+"/";
        $.ajax({
            url:linkRequest,
            type:"GET",
            dataType:"json"
        }).done(function(data){
            $(".name-pokemon").text(data.forms[0].name);
            for(i=0;i<data.abilities.length;i++){
                $(".ability-"+(i+1)).text(data.abilities[i].ability.name);
            }
    
            
            loadImageDetails(data.forms[0].url);
            
        });
         
        
    });

    $(document).on("click",".add",function(){
        var element = $(this);
        var pokemon = $(this).val();
        $.ajax({
            url:"/addpokemon/"+pokemon,
            type:"GET"
        }).done(function(){
            $(element).removeClass("add");
            $(element).addClass("remove");
            $(element).text("REMOVER");
        });
        
    });
    $(document).on("click",".remove",function(){
        var element = $(this);
        var pokemon = $(this).val();
        $.ajax({
            url:"/deletepokemon/"+pokemon,
            type:"GET"
        }).done(function(){
            $(element).removeClass("remove");
            $(element).addClass("add");
            $(element).text("ADICIONAR");
        });
        
    });
    $(".modal-pokemon-bg").click(function(e){
        if (e.target != this) return;
        closeModalPokemon();
    });

    $(document).keydown(function(e){
        if(e.keyCode == 27){
            closeModalPokemon();    
        }
    });

    $(".menu-username").click(showHideOptions);
    $(".options-user-bg").click(function(e){
        if (e.target != this) return;
        showHideOptions();
    });



    // User 





});