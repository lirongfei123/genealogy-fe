define([
    'ltpl!./select-search.html'
],function(){
    $.fn.selectSearch = function(option){
        /// (☆＿☆) logic ~ 组件默认参数
        var defaultOption = {
            url:"",
            callback:function(){}
        }
        $.extend(defaultOption,option);

        /// (☆＿☆) logic ~ 组件级别的全局变量
        var currentValue = null, //当前搜索结果中选中的元素
            searchContainer = null, //搜索结果的容器
            mainElem = null,
            searchInput = null,
            dropDownHideClickFn;

        /// (☆＿☆) logic ~ 对外提供接口
        var returnValue = {
            searchInput:function(){
                return searchInput;
            }
        };
        /// (☆＿☆) logic ~ 初始化组件
        $(this).html(etpl.render('component-select-search',option));
        searchContainer = $(this).find(".search-container")[0];
        mainElem = $(this).find('.search-select-container')[0];
        searchInput = $(this).find(".js-search-input")[0];
        /// (☆＿☆) logic ~ 组件事件监听
        $(this).bind("click",function(event){
            var target = event.target;
            var className = target.className;
            //如果是点击搜索
            if($(target).hasClass("btn-search")){
                eventHandler.search();
                return;
            }
            //点击其他按钮
            if($(target).hasClass("js-other-btn-item")){
                option.otherBtns.forEach(function(value){
                    if(value.text==target.innerText){
                        value.callback();
                    }
                });
            }

        });
        $(searchContainer).bind("click",function(event){
            if($(event.target).findParents({className:"js-search-list-item"})){
                currentValue = event.target;
                eventHandler.chooseSearch(event);
            }
        });
        searchInput.addEventListener("keydown",function(event){
            if(event.keyCode == 13){
                event.preventDefault();
                eventHandler.search();
                return;
            }
        },false)
        /// (☆＿☆) logic ~ 组件内部交互逻辑

        //事件处理核心逻辑
        var eventHandler = {
            //搜索
            search:function(){
                var name = searchInput.value;
                if(name.trim()=="") {
                    alert("输入搜索");
                    return;
                }
                $.get(option.url, {name:name}, function(data){
                    data = JSON.parse(data);
                    searchContainer.innerHTML = etpl.render("component-select-search-list",{result:data});
                    showSearchResult();
                });
            },
            //添加新成员
            addNewPerson:function(){

            },
            //点击搜索结果
            chooseSearch: function(event){
                option.callback({text:currentValue.innerText,id:currentValue.getAttribute("js-id")});
                event.stopPropagation();
                hideSearchResult();
            }
        }
        return returnValue;
        // 显示搜索结果
        function showSearchResult(){
            document.body.appendChild(searchContainer);
            searchContainer.style.visibility = "hidden";
            searchContainer.style.display = "block";
            var offset = $(mainElem).offset();
            searchContainer.style.top = offset.top + mainElem.offsetHeight  + "px";
            searchContainer.style.left = offset.left + "px";
            searchContainer.style.visibility = "visible";
            $(document.body).bind("click", dropDownHideClickFn = function(event){
                var target = event.target;
                if(!(searchContainer.contains(target) || mainElem.contains(target))){
                    hideSearchResult();
                }
            });
        }
        // 隐藏搜索界面
        function hideSearchResult(){
            searchContainer.style.visibility = "hidden";
            searchContainer.style.display = "none";
            mainElem.appendChild(searchContainer);
            $(document.body).unbind("click", dropDownHideClickFn);
        }
    }
});