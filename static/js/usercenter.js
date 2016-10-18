define([
    'module/pnotify/pnotify.nonblock',
    'module/select-search/select-search'
    ],function(PNotify){
    var searchResult = [];
    plan.addFrag("userSetting",{
        main:"main-body",
        view:"user-setting",
        onrender:function(){
            /// (☆＿☆) logic ~ 全局变量
            var myparent,
                myself,
                myParentComponent,
                myParentInput,
                mySelfComponent,
                mySelfInput,
                formElem;

            /// (☆＿☆) logic ~ 初始化组件
            formElem = $("#user-setting-form")[0];
            $.get("/my-project/genealogy/index.php?member!getUserSetting",function(data){
                data = JSON.parse(data).data;
                if(!(data.parentid==null||data.parentid=="")){
                    myParentInput.value = data.parentname;
                    myparent = data.parentid;
                }
                if(!(data.myselfid==null||data.myselfid=="")){
                    mySelfInput.value = data.myselfname;
                    myself = data.myselfid;
                }
            })
            myParentComponent = $('#js-my-parent').selectSearch({
                url:"/my-project/genealogy/index.php?search!searchByName",
                otherBtns:[
                    {
                        text:"添加新成员",
                        callback:function(){
                            window.open("#/index/adduser?type=popup","_blank");
                        }
                    }
                ],
                callback:function(value){
                    myParentInput.value = value.text;
                    myparent = value.id;
                }
            });
            myParentInput = myParentComponent.searchInput();
            mySelfComponent = $('#js-myself').selectSearch({
                url:"/my-project/genealogy/index.php?search!searchByName",
                otherBtns:[
                    {
                        text:"添加新成员",
                        callback:function(){
                            window.open("#/index/adduser?type=popup","_blank");
                        }
                    }
                ],
                callback:function(value){
                    mySelfInput.value = value.text;
                    myself = value.id;
                }
            });
            mySelfInput = mySelfComponent.searchInput();

            /// (☆＿☆) logic ~ 数据提交
            formElem.addEventListener("submit", function(event){
                event.preventDefault();
                $.post("/my-project/genealogy/index.php?member!userSetting",{
                    parentid:myparent,
                    myselfid:myself,
                    parentname:myParentInput.value,
                    myselfname:mySelfInput.value
                }, function(data){
                    data = JSON.parse(data);
                    if(data.code==200){
                        new PNotify({
                            title: "个人设置",
                            text: "操作成功",
                            type: 'info'
                        });
                        setTimeout(function(){
                            location.reload();
                        },1000);
                    }
                });
            });
        }
    });
});