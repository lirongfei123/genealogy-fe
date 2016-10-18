require(['module/sso/sso','module/storage/storage','module/jquery/jquery'], function(sso,storage){
	sso.checkLogin({
        success:function(){
        	sso.getUserInfo(function(info){
                info = JSON.parse(info);
                storage.setItem(info);
                $.ajax({
                    method:"post",
                    url:"/my-project/genealogy/index.php?login!register",
                    data:info,
                    success:function(jsonData){
                        jsonData = JSON.parse(jsonData);
                        if(jsonData.status == 200) {

                            location.href = "index.html";
                        }
                    }
                });
        	});
        },
        error:function(){
            sso.login();
        }
    });
});