var loginStatus; 
a=false;
function verifyLogin(callback){
    $.ajax({
        url:"/verifylogin",
        type:"GET",
        dataType:"json"
    }).done(function(data){
        loginStatus = data;
    })
}


verifyLogin();



$(function(){
//page user
function refreshUser(){
    $(document).ajaxComplete(function(){
        if(loginStatus.loginOn){
            $(".menu-nav li").text(loginStatus.username);
            $(".modal-content").css("display","none");
            $(".login-error").css("display","flex");
            $(".menu-login p").text(loginStatus.username)
            if(loginStatus.urlphoto){
                $(".profile-photo").attr("src",loginStatus.urlphoto);
            }else{
                $(".profile-photo").attr("src","/res/img/user-default.jpg");
            }
        }
    });
}
refreshUser();

//Login and Register Modal - Open and Close
loginOn = true;
function modalClose (){
    $(".modal-bg").css("display","none");
    clearInput();  
    loginOn=true;
}

function closeMenuUser(){
    $(".menu-login-bg").fadeOut("fast"); 
}
function loginOpen(){
    verifyLogin();
    $(document).ajaxComplete(function(){
        if(loginStatus.loginOn){
            $(".menu-login-bg").fadeIn("fast");
        }else{
            $(".login").css("display","flex");   
        }
    });
      
}
function toggleLoginRegister(){
    
    if(loginOn){
        $(".login").css("display","none");
        $(".register").css("display","flex");
        clearInput();
        
        loginOn=false;
    }else{
        $(".login").css("display","flex");
        $(".register").css("display","none");
        clearInput();
        loginOn = true;
    }
}
    

$(".close").click(modalClose);
$(".menu-bg li").click(loginOpen);
$(".menu-login-bg").click(function(e){
    if (e.target != this) return;
    closeMenuUser();
});
$(".modal-content p").click(toggleLoginRegister);



//login and register
function clearInput(){
    $("form input").val("");
    $(".error p").text("");
}
//Post Register



$("#register-post").submit(function(){
    $.ajax({
        url: "/register",
        type: "POST",
        data: $("#register-post").serialize(),
        dataType: "json",
        success: function(data){
            if(!data.status){
                $(".error p").text(data.error);
            }else{
                $(".error p").text(" ");
                clearInput();
                $(".register").css("display","none");
                loginOn = true;
            }
            
        }
    });
    
    return false;
});

//Post Login
$("#login-post").submit(function(){
    $.ajax({
        url: "/login",
        type: "POST",
        dataType: "json",
        data: $("#login-post").serialize(),
        
    }).done(function(data){
        if(!data.status){
            $(".error p").text(data.error);
        }else{
            verifyLogin();
            refreshUser();
            $(document).ajaxComplete(function(){
                clearInput();
                $(".error p").text(" ");
                $(".login").css("display","none");
                $(".register").css("display","none");
                $(".menu-login-bg").css("display","none");
            })
            
            loginOn = true;
            
        }
        
    });
    
    return false;
});

})