define(['./dragView','module/pnotify/pnotify.nonblock'], function(dragView,PNotify){
    var searchResult = [];
    var advancedSearchParams = null;
    plan.addFrag("search",{
        main:"main-body",
        view:"advanced-search",
        onrender:function(){

            /// (☆＿☆) logic ~ 全局变量
            var formElem;

            /// (☆＿☆) logic ~ 初始化组件
            formElem = $("#search-member-form")[0];

            /// (☆＿☆) logic ~ 数据提交
            formElem.addEventListener("submit", function(event){
                event.preventDefault();
                plan.redirect("/index/search_result?name="+formElem.elements['name'].value);
            });



        }
    });
    plan.addFrag("searchResult", {
        model:function(context){
            var defer = plan.Q.defer();
            var name = plan.search().name;
            if(typeof name!="undefined"){
                $.get("/my-project/genealogy/index.php?search!search",{name:name},function(data){
                        searchResult = JSON.parse(data).data;
                        defer.resolve({result:searchResult});
                });
                return defer.promise;
            }else{
                return {result:searchResult};
            }
        },
        main:"main-body",
        view:"search-result",
        onrender:function(context){
            $("#searchContainer").click(function(event){
                var target = event.target;
                if($(target).hasClass("delbtn")){
                    var memberid = target.getAttribute("memberid");
                    $.get("/my-project/genealogy/index.php?member!delMember",{id:memberid},function(data){
                        data = JSON.parse(data);
                        if(data.data=="ok"){
                            setTimeout(function(){
                                var td = target.parentNode.parentNode;
                                td.parentNode.removeChild(td);
                                new PNotify({
                                    title: "删除家族成员",
                                    text: "操作成功",
                                    type: 'info'
                                });
                            },500);
                        }

                    });
                }
            });
        }
    });
    plan.addFrag("advancedSearchResult", {
        model:function(){
            var searchParams = plan.search();
            if(typeof searchParams.id=="undefined" && advancedSearchParams!=null){
                return advancedSearchParams;
            }else{
                advancedSearchParams = searchParams;
            }
            return searchParams;
        },
        main:"main-body",
        view:"myhome",
        onrender:function(context){
            dragView('myhome-wrap',context.id,context.id,context.type);
        }
    });
});