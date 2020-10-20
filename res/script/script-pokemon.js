var userData;
$(function(){
    $.ajax({
        url:"/verifylogin",
        type:"GET",
        dataType:"json"
    }).done(function(data){
        $(".menu-username p").text(data.username);
        $(".img-user-menu-mobile p").text(data.username); 
        $(".user-name p").text(data.username);
        $(".user-name input").val(data.username);
        $("title").text(data.username);
        if(data.urlphoto){
            $(".profile-photo").attr("src",data.urlphoto);
        }else{
            $(".profile-photo").attr("src","/res/img/user-default.jpg");
        }
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

    // profile   
    $("#select-file").change(function(e){
        var type = this.files[0].type;
        type = type.split("/")[0];
        if(type=="image"){
            $(".photo-edit p").text("");
            var r= new FileReader();
            r.readAsDataURL($("#select-file")[0].files[0]);
            r.onload = function(e){
                $(".modal-selected-img-bg").css("display","flex");
                $(".selected-img img").attr("src", e.target.result); 
            }
        }else{
            this.value = null;
            $(".photo-edit p").text("Arquivo Inválido, Tente Novamente");
        }
        
        
    });

    $(".confirm").click(function(){
        $(".thumb-width").attr("value",$(".selected-img").width());
        $(".thumb-height").attr("value",$(".selected-img").height());
        $(".cropp-width").attr("value",$(".selector").width());
        $(".cropp-height").attr("value",$(".selector").height());
        $(".cropp-top").attr("value",($(".selector").offset().top - $(".selected-img").offset().top));
        $(".cropp-left").attr("value",($(".selector").offset().left - $(".selected-img").offset().left));
        $(".photo-edit form").submit();
    });



    $(".cancel").click(function(){
        $(".modal-selected-img-bg").css("display","none");
        $("#select-file").val("");    
    });

    $(".select-img").click(function(e){
        $("#select-file").trigger('click');
    });
    var mousePositionX ;
    var mousePositionY ;
    // $(".selector").on("mousemove",function(){
    //     $("body").css("cursor","none");    
    // });
   
    
    $(".selector").on("mousedown",function(event){
        if (event.target != this) return;
        mousePositionX = event.offsetX;
        mousePositionY = event.offsetY;
        
        $(document).on("mousemove",function(e){
            var selectorMoveLeft = (e.clientX - $(".modal-selected-img").offset().left)-mousePositionX; 
            var selectorMoveTop = (e.clientY - $(".modal-selected-img").offset().top)-mousePositionY;
            if(selectorMoveLeft > -1 && selectorMoveLeft < ($(".selected-img").width() - $(".selector").width())-2 ){
                $(".selector").css("left",selectorMoveLeft );
            }
            if(selectorMoveTop >-1 && selectorMoveTop < ($(".selected-img").height() - $(".selector").height())-2 ){
                $(".selector").css("top",selectorMoveTop);
            }
            
           
          
            // $(".selector").css("top",e.pageY);
            
            $(document).on("mouseup",function(){
                $(document).off("mousemove");   
            })
           
        });
        
        
    }).on("mouseup",function(){
        $(document).off("mousemove");
        
    });

    $(".selector-size").on("mousedown",function(e){
        if (e.target != this) return;
        yAnterior = $(".selector-size").offset().top;
        xAnterior = $(".selector-size").offset().left;
        mousePositionX = e.offsetX;
        mousePositionY = e.offsetY;
        $(document).on("mousemove",function(event){
            var sizeMoveLeft =(event.pageX - $(".modal-selected-img").offset().left) - (mousePositionX-5);
            var sizeMoveTop =  (event.pageY - $(".modal-selected-img").offset().top) - (mousePositionY+5);
            if(sizeMoveLeft > -1 && sizeMoveLeft < ($(".selected-img").width() - $(".selector").width())-2 ){
                $(".selector").css("left", sizeMoveLeft );
            }
            if(sizeMoveTop >-1 && sizeMoveTop < ($(".selected-img").height() - $(".selector").height())-2 ){
                $(".selector").css("top", sizeMoveTop);
            }
            

           
            
            yAtual = $(".selector-size").offset().top;
            xAtual = $(".selector-size").offset().left;
            if(yAtual<yAnterior && xAtual<xAnterior){
                var widthQuadrado = $(".selector").width();
                var heightQuadrado = $(".selector").height();
                move = yAnterior-yAtual;
                $(".selector").width(widthQuadrado+move);
                $(".selector").height(heightQuadrado+move);


     
            }
            if(yAtual>yAnterior && xAtual>xAnterior){
                var widthQuadrado = $(".selector").width();
                var heightQuadrado = $(".selector").height();
                move = yAnterior-yAtual;
                $(".selector").width(widthQuadrado+move);
                $(".selector").height(heightQuadrado+move);


     
            }
            // console.log(xAtual - xAnterior);
            // console.log(yAtual - yAnterior);
            xAnterior = xAtual;
            yAnterior = yAtual;
            $(document).on("mouseup",function(){
                $(document).off("mousemove");
            }); 
            
            
        }).on("mouseup",function(){
            $(document).off("mousemove");
        });

    });

    $(".photo-edit form").submit(function(){
        // var files =$("#select-file").prop('files')[0];
        formData = new FormData(this);
        // formData.append('file',files);
        
        $.ajax({
            url: "/user/changeimage",
            type: "POST",
            data: formData,
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false
            
        }).done(function(data){
    
        });
        location.reload();
        return false; 
        
       
    });
    $(".username-edit-form").submit(function(){

        $.ajax({
            url: "/user/changeusername",
            type: "POST",
            data: $(this).serialize(),
            dataType: "json",
            
        }).done(function(data){
            if(data.status){
                location.reload();
            }
            
            
            
            
            
        });
       
        return false;
         
        
        
        
       
    });

    $(".username-edit img").click(function(){
        $(".user-name p").css("display","none");
        $(".user-name form").css("display","block");
        $(".user-name input").focus();
        $(this).css("display","none");

    });

    $(".username-edit-cancel").click(function(){
        $(".user-name p").css("display","block");
        $(".user-name form").css("display","none");
        $(".username-edit img").css("display","block");     
    });

   






});