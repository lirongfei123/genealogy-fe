require([
    'module/sso/sso',
    'module/storage/storage',
    'module/bootstrap/js/bootstrap',
    './raphael',
    'module/plan/src/plan'], function(sso,storage) {
    require(['','../tpl/all','./adduser','./myhome','./search','./usercenter'], function() {
        /* global console:true */
        plan.route("index", {
            beforeOne: function(context) {
                sso.checkLogin({
                    success:function(){
                        plan.callFrag("renderUserInfo",{
                            model:{
                                username:storage.getItem("username")
                            },
                            onrender:function(){
                                $("#loginout").click(function(){
                                    sso.loginout();
                                    location.reload();
                                });
                            }
                        });
                    },
                    error:function(){
                        location.href="login.html";
                    }
                });
                $("#js-index-search").bind("submit",function(event){
                    event.preventDefault();
                    plan.redirect("/index/search_result?name="+event.target.elements['search'].value);
                    event.target.elements['search'].value="";
                });
            },
            before:function(){
                //获取当前action
                var path = plan.path();
                var action = path.substring(path.lastIndexOf("/")+1);
                $("#menu-list").find('.'+action).addClass("focused").siblings().removeClass("focused");
            },
            action: {
                index:function(){

                },
                adduser:function(){
                    plan.callFrag("adduser");
                },
                myhome:function(){
                    plan.callFrag("myhome");
                },
                search:function(){
                    plan.callFrag("search");
                },
                search_result:function(){
                    $("#search-result-menu-item").show();
                    plan.callFrag("searchResult");
                },
                advanced_search_result(){
                    $("#advanced-search-result").show();
                    plan.callFrag("advancedSearchResult");
                },
                center:function(){
                    plan.callFrag("userSetting");
                }
            }
        }).childrenRoute("adduser", {
            beforeOne: function() {
                console.log("list 执行一次");
            },
            action: {
                detail: function() {
                    console.log("执行list的action detail");
                },
                detail2: function() {
                    console.log("执行list的action detail2");
                }
            }
        });
        plan.bootstrap();
    });

});
