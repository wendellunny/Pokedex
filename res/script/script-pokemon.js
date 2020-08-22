$(function(){
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
            console.log("aparece");  
        }else{
            console.log("some");
            $(".options-user-bg").css("display","block");
            $(".options-user-bg").addClass("options-user-animate");
            setTimeout(function(){
                $(".options-user-bg").css("display","none");   
            },400);

        }
        
    }

    $(".more").click(function(){
        $(".modal-pokemon-bg").css("display","flex");    
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


});