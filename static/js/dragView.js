define(function(){
    function drawView(mainElem,parentid,ownid,type){
        plan.callFrag('drawView',{
            model:{
                parentid:parentid,
                ownid:ownid,
                type:type
            },
            main:mainElem,
        });
    }
    plan.addFrag("drawView",{
        view:"draw-view",
        onrender:function(context){
            if(typeof context.type!="undefined"){
                if(context.type=="liudai"){
                    sandaiView(context.ownid);
                }else{
                    parentView(context.parentid);
                }
            }else{
                sandaiView(context.ownid);
            }
            $("#js-parent-view").click(function(){
                parentView(context.parentid);
            });
            $("#js-six-view").click(function(){
                sandaiView(context.ownid);
            });
            var oldX,oldY,isMove,svgElem,moveListener,upListener;
             $("#svg-wrap").bind("contextmenu", function(event){
                event.preventDefault();
                event.stopPropagation();
            });
            $("#svg-wrap").bind("mousedown", function(event){
                if(event.button==2){
                    oldX = event.clientX;
                    oldY = event.clientY;
                    isMove = true;
                    svgElem = $(this).find("svg")[0];
                    var left = isNaN(parseInt($(svgElem).css("left")))?0:parseInt($(svgElem).css("left"));
                    var top = isNaN(parseInt($(svgElem).css("top")))?0:parseInt($(svgElem).css("top"));
                    $(document).bind("mousemove", moveListener = function(event){
                        if(isMove){
                            $(svgElem).css({
                                left:left + event.clientX - oldX,
                                top:top + event.clientY - oldY
                            });
                        }
                    });
                    $(document).bind("mouseup", upListener = function(event){
                        isMove = false;
                        $(document).unbind("mouseup",upListener);
                        $(document).unbind("mousemove",moveListener);
                    });
                }

            });
            function parentView(id){
                $.get("/my-project/genealogy/index.php?member!getParentView",{id:id},function(data){
                    $("#js-six-view").removeClass('btn-primary');
                    $("#js-parent-view").addClass('btn-primary');
                    data = JSON.parse(data);
                    document.getElementById("svg-wrap").innerHTML = "";
                    dragZuZhi(document.getElementById("svg-wrap"),data.data);

                });
            }

            function sandaiView(id){
                 $.get("/my-project/genealogy/index.php?member!getSaidaiView",{id:id}, function(data){
                    $("#js-six-view").addClass('btn-primary');
                    $("#js-parent-view").removeClass('btn-primary');
                    data = JSON.parse(data).data;
                    document.getElementById("svg-wrap").innerHTML = "";
                    dragZuZhi1(document.getElementById("svg-wrap"),
                        handleSpouse(data.parent,"left"),
                        handleSpouse(data.mother,"right"),
                        handleSpouse(data.own));
                });
            }
            function handleSpouse(data,type){
                if(typeof type!="undefined"){
                    if(data.childrens.length<2){
                        if(type=="left"){
                            data.childrens.unshift({
                                "name":"无数据",
                                "spouse":"无数据"
                            });
                        }else{
                            data.childrens.push({
                                "name":"无数据",
                                "spouse":"无数据"
                            });
                        }
                    }

                }
                data.name = data.name + " 配偶：" + data.spouse;
                if(typeof data.childrens!="undefined" && data.childrens.length>0){
                    data.childrens = data.childrens.map(function(value){
                        return handleSpouse(value);
                    });
                }
                return data;
            }
        }
    });
    return drawView;
});
function getNodesWidth (nodes){
    var nodes = JSON.parse(JSON.stringify(nodes));
    var fontWidthHeloer = document.getElementById("fontWidthHelper"),
        paddingWidth = 30,
        marginWidth = 0;
    function parseNodeWidth(node, parentNode) {
        var selfWidth, childWidth = 0;
        fontWidthHelper.innerHTML = node.name;
        selfWidth = fontWidthHelper.getBoundingClientRect().width + paddingWidth;
        if (node.childrens && node.childrens.length > 0) {
            var childsInfo = [];
            node.childrens.forEach(function(childNode,key) {
                var richSpace = false,
                    richSpaceWidth = 0;
                var nodeWidth = parseNodeWidth(childNode, node);
                if(childNode.childrens && childNode.childrens.length>0){
                    richSpace = true;
                    richSpaceWidth = nodeWidth/2 - childNode.selfWidth/2;
                }
                //在这里偷个懒，如果检测到这个是不能向前合并的元素，那么就特殊例外进行设置
                if(childNode.disableMerge){
                    richSpace = true;
                }
                childNode.richSpace = richSpace;
                childsInfo.push({
                    richSpace:richSpace,
                    width:nodeWidth,
                    name:childNode.name,
                    offsetWidth:nodeWidth + marginWidth,
                    richSpaceWidth:richSpaceWidth,
                    hasSetOffset:false
                });
            });

            // 计算整个节点需要的宽度，减去富裕空间宽度
            for(var i =0,ii=childsInfo.length;i<ii;i++){
                var nodeWidth = childsInfo[i].width;
                if(childsInfo[i].richSpace) {
                    //如果是富裕空间元素，就检查他下面兄弟节点，能不能借用其空间，
                    //但是中间可以跟随，非富裕空间元素,
                    //借用空间的意思就是，当前没有子元素的节点宽度不计算在父元素宽度在内
                    richSpaceLeftWidth = richSpaceRightWidth = childsInfo[i].richSpaceWidth;
                    //检测右边
                    var iii = i;
                    while(iii < ii-1 && richSpaceRightWidth > 0){
                        iii++;
                        //向后查找，非富裕空间元素
                        if(!childsInfo[iii].richSpace){
                            //如果富裕空间空间充足，就把前面这个节点的占位空间设置为0
                            if(richSpaceRightWidth > childsInfo[iii].width + marginWidth) {
                                childsInfo[iii].offsetWidth = 0;
                                richSpaceRightWidth = richSpaceRightWidth - (childsInfo[iii].width + marginWidth);
                            } else{

                                //如果富裕空间空间不足，就充分利用富裕空间空间，计算出最小占位空间
                                childsInfo[iii].offsetWidth = childsInfo[iii].width + marginWidth - richSpaceRightWidth;
                                richSpaceRightWidth = 0;
                            }
                        }else{
                            break;
                        }
                    }
                    //检测左边 有没有可以被富裕空间的元素，直到第一个元素，或者富裕空间宽度用尽
                    var iii = i;
                    while(iii>0 && richSpaceLeftWidth>0){
                        iii--;
                        //向前查找，非富裕空间元素，遇到富裕空间
                        if(!childsInfo[iii].richSpace && childsInfo[iii].offsetWidth != 0){
                            //如果富裕空间空间充足，就把前面这个节点的占位空间设置为0
                            if(richSpaceLeftWidth > childsInfo[iii].width + marginWidth) {
                                childsInfo[iii].offsetWidth = 0;
                                richSpaceLeftWidth = richSpaceLeftWidth - (childsInfo[iii].width + marginWidth);
                            } else{
                                //如果富裕空间空间不足，就充分利用富裕空间空间，计算出最小占位空间
                                if(childsInfo[iii].offsetWidth != childsInfo[iii].width + marginWidth) {
                                    //如果这个节点已经占用了前面他前面的一个富裕元素节点的富裕空间，那么就减去这个的
                                    childsInfo[iii].offsetWidth = Math.max(0, childsInfo[iii].offsetWidth - (childsInfo[iii].width + marginWidth - richSpaceLeftWidth));
                                }else{
                                    childsInfo[iii].offsetWidth = childsInfo[iii].width + marginWidth - richSpaceLeftWidth;
                                }
                                richSpaceLeftWidth = 0;
                            }
                        }else{
                            break;
                        }
                    }
                }
            }
            // 计算整个节点需要的宽度，减去富裕空间宽度
            for(var i =0,ii=childsInfo.length;i<ii;i++){
                childWidth += childsInfo[i].offsetWidth;
            }
        }
        node.parentNode = parentNode;
        node.selfWidth = selfWidth;
        node.width = Math.max(selfWidth, childWidth);
        return Math.max(selfWidth, childWidth);
    }
    parseNodeWidth(nodes);
    return nodes;
}
function getNodesInfo(nodes,x,y,isGetDiff){
    var marginWidth = 0,
        theDisableMergeNode = null,
        totalIndex = 0,
        firstNodeX = x,
        firstNodeY = y,
        diffInfo = {};
    function parseNodePosition(node, index) {
        //如果是第一个元素
        if (typeof node.parentNode == 'undefined') {
            node.x = firstNodeX;
            node.y = firstNodeY;
        }
        index++;
        if (node.childrens) {
            var prevNode = null,
                nextRichSpaceStart=0,//下一个富裕空间元素的开始位置
                prevRichSpaceWidthEnd=0,//前一个富裕空间的结束位置
                prevStartIndex=0,//前一个富裕空间元素的索引
                prevRichSpaceEnd = 0;//前一个富裕空间元素的结束为止
            node.childrens.forEach(function(childNode, key) {
                var parentNode = childNode.parentNode;
                if (key === 0) {
                    //第一个元素是根据整体的总宽度设置第一个元素的位置
                    childNode.x = parentNode.x + parentNode.selfWidth/2-parentNode.width/2 + childNode.width/2 - childNode.selfWidth/2;
                    //保存下一个富裕空间元素开始位置
                    nextRichSpaceStart = childNode.x  + childNode.width/2 + childNode.selfWidth/2;
                    if(childNode.richSpace){
                        prevRichSpaceWidthEnd = nextRichSpaceStart;
                    }else{
                        prevRichSpaceWidthEnd = childNode.x;
                    }
                    //保存前一个富裕空间的标题结束位置
                    prevRichSpaceEnd = childNode.x + childNode.selfWidth;
                } else {
                    //剩下的元素就要考虑，相邻的是否是富裕空间元素，如果是富裕空间元素
                    if(!childNode.richSpace){//如果不是富裕元素
                        childNode.x = prevNode.x + prevNode.selfWidth + marginWidth;
                        if(nextRichSpaceStart <= childNode.x + childNode.selfWidth) {
                            nextRichSpaceStart = childNode.x + childNode.selfWidth;
                        }
                    }else{
                        var keyong1 = prevNode.x + prevNode.selfWidth - prevRichSpaceWidthEnd;
                        var keyong2 = childNode.width/2 - childNode.selfWidth/2;
                        if(keyong1 > keyong2){
                            var xixi = prevRichSpaceWidthEnd + keyong1-keyong2;
                        }else{
                            var xixi = prevRichSpaceWidthEnd;
                        }
                        childNode.x = xixi + childNode.width/2 - childNode.selfWidth/2 + marginWidth;
                        //将前面的非富裕空间元素重新计算位置
                        var diff = key-prevStartIndex;
                        if(diff > 1){
                            //总区间
                            var totalSpace = childNode.x - prevRichSpaceEnd,
                                totalNodeWidth = 0,
                                prevNodeEnd = prevRichSpaceEnd,
                                newMargin;
                            var diffI = diff;
                            while(diffI>1){
                                diffI--;
                                totalNodeWidth += node.childrens[key-diff].selfWidth;
                            }
                            newMargin = (totalSpace - totalNodeWidth)/diff;
                            diffI = diff;
                            while(diffI>1){
                                diffI--;
                                //node.childrens[key-diffI].x = prevNodeEnd + newMargin;
                                prevNodeEnd = prevNodeEnd + newMargin + node.childrens[key-diffI].selfWidth;
                            }
                        }
                        prevStartIndex = key;//重置上一个富裕空间元素
                        nextRichSpaceStart = childNode.x + childNode.selfWidth/2 + childNode.width/2;
                        prevRichSpaceEnd = childNode.x + childNode.selfWidth;
                        prevRichSpaceWidthEnd = nextRichSpaceStart;
                    }
                }
                if(index > totalIndex){
                    totalIndex = index;
                }
                childNode.y = 100 * index + firstNodeY;
                childNode.index = index;
                childNode.index2 = index;
                //如果只是获取到元素的差值，就直接返回差值了
                if(isGetDiff && childNode.disableMerge) {
                    theDisableMergeNode = childNode;
                    childNode.y = 100 * totalIndex + firstNodeY;
                    diffInfo.x = childNode.x - firstNodeX;
                    diffInfo.y = childNode.y - firstNodeY;
                }
                prevNode = childNode;
                parseNodePosition(childNode, index);
            });
        }
    }
    parseNodePosition(nodes, 0);
    if(theDisableMergeNode != null) {
        theDisableMergeNode.y = 100 * totalIndex + firstNodeY;
        theDisableMergeNode.index2 = totalIndex;
        diffInfo.x = theDisableMergeNode.x - firstNodeX;
        diffInfo.y = theDisableMergeNode.y - firstNodeY;
    }
    return {
        nodes:nodes,
        totalIndex:totalIndex,
        diffInfo:diffInfo
    }
}
function drawNode(node,paper){
    if(node.parentNode!=null){
        paper.path("M" +(node.x+node.selfWidth/2)+" "+(node.y-40) + "L" + (node.x+node.selfWidth/2) + " " + (node.y-10));
    }
    if(!node.disableMerge){
        paper.text(node.x+node.selfWidth/2, node.y, node.name);
    }
    var prevNode = null;
    if (node.childrens) {
        paper.path("M" +(node.x+node.selfWidth/2)+" "+(node.y+10) + "L" + (node.x+node.selfWidth/2) + " " + (node.y+60));
        node.childrens.forEach(function(childNode, key) {
            drawNode(childNode,paper);
            if(prevNode) {
               var prevNodePosition = {
                    x:(prevNode.x + prevNode.selfWidth/2),
                    y:prevNode.y - 40
                }, nowNodePosition = {
                    x:(childNode.x+childNode.selfWidth/2),
                    y:childNode.y-40
                };

                if(childNode.index2 != childNode.index){
                    var diff = childNode.index2 - childNode.index;
                    nowNodePosition.y = nowNodePosition.y - 100*diff;
                }
                if(prevNode.index2 != prevNode.index){
                    var diff = prevNode.index2 - prevNode.index;
                    prevNodePosition.y = prevNodePosition.y - 100*diff;
                }
                paper.path("M" + prevNodePosition.x + " " + prevNodePosition.y + "L" + nowNodePosition.x + " " + nowNodePosition.y);
                paper.path("M" + nowNodePosition.x + " " + nowNodePosition.y + "L" +  nowNodePosition.x + " " + (nowNodePosition.y+30+diff*100));
            }else{
                var nowNodePosition = {
                    x:(childNode.x+childNode.selfWidth/2),
                    y:childNode.y-40
                }
                if(childNode.index2 != childNode.index){
                    var diff = childNode.index2 - childNode.index;
                    nowNodePosition.y = nowNodePosition.y - 100*diff;
                }
                paper.path("M" + nowNodePosition.x + " " + nowNodePosition.y + "L" +  nowNodePosition.x + " " + (nowNodePosition.y+30+diff*100));
            }
            prevNode = childNode;
        });
     }
}
function dragZuZhi(elem,data){
    var svgWidth = svgHeight = 0;
    var nodes = getNodesWidth(data);
    svgWidth = nodes.width;
    var x = svgWidth/2 - nodes.selfWidth/2,y = 50;
    var nodesInfo = getNodesInfo(nodes,x,y,true);
    svgHeight = 100 * (nodesInfo.totalIndex+1) + 50;
    nodes = nodesInfo.nodes;
    var paper = Raphael(elem, svgWidth*3, svgHeight*3);
    drawNode(nodes,paper);
}
function dragZuZhi1(elem,parentdata,motherdata,owndata){
    var nodes = getNodesWidth(owndata);
    var nodePrevs = getNodesWidth(parentdata);
    var nodeNexts = getNodesWidth(motherdata);

    var firstNodesInfo = getNodesInfo(nodePrevs,0,0,true);
    var secondNodesInfo = getNodesInfo(nodes,0,0,true);
    var thirdNodesInfo = getNodesInfo(nodeNexts,0,0,true);
    // 先算出中间那个树的x位置，y位置
    // x位置是第一个树和中间树默认x位置的最大值
    // y位置是第一个树和第三个树高度的最大值+50
    var svgWidth = svgHeight = 0;
    svgWidth = nodes.width;
    var autoSecondX = svgWidth/2 - nodes.selfWidth/2,
        autoSecondY = 50;
    var secondX = Math.max(nodePrevs.width,autoSecondX);
    var secondY = Math.max(firstNodesInfo.totalIndex,thirdNodesInfo.totalIndex)*100 + 50;
    // 算出第一个 根节点的x，y
    var firstX = secondX - firstNodesInfo.diffInfo.x;
    var firstY = secondY - firstNodesInfo.diffInfo.y;
    //算出第三个 根节点的x，y
    var thirdX = secondX - thirdNodesInfo.diffInfo.x;
    var thirdY = secondY - thirdNodesInfo.diffInfo.y;
    //算出整个svg的宽度
     var totalWidth = totalHeight = 0;
     totalWidth = secondX + nodes.width - autoSecondX + nodeNexts.width;
     totalHeight = secondY + secondNodesInfo.totalIndex * 100 +50;
     var paper = Raphael(elem, totalWidth, totalHeight);

     var finalFirstNodeInfo = getNodesInfo(nodePrevs,firstX,firstY,true);
     var finalSecondNodeInfo = getNodesInfo(nodes,secondX,secondY,true);
     var finalThirdNodeInfo = getNodesInfo(nodeNexts,thirdX,thirdY,true);
    //var nodesInfo = getNodesInfo(nodes,x,y,true);
    //svgHeight = 100 * (nodesInfo.totalIndex+1) + 50;
    //nodes = nodesInfo.nodes;
    drawNode(finalFirstNodeInfo.nodes,paper);
    drawNode(finalSecondNodeInfo.nodes,paper);
    drawNode(finalThirdNodeInfo.nodes,paper);
}
/*
var dataPrev = {
    parent: "朱元璋",
    mother: "马皇后",
    name: "朱元章111",
    childrens:[
        {
            parent: "朱棣",
            mother: "朱棣老婆",
            name: "朱元章"
        },
        {
            parent: "朱棣",
            mother: "朱棣老婆",
            name: "朱元章",
            disableMerge:true
        }
    ]
};
var dataNext = {
    parent: "朱元璋",
    mother: "马皇后",
    name: "朱元章2",
    childrens:[
        {
            parent: "朱棣",
            mother: "朱棣老婆",
            name: "朱元章",
            disableMerge:true
        },
        {
            parent: "朱棣",
            mother: "朱棣老婆",
            name: "李善长1"
        }
    ]
}
var data = {
        parent: "朱元璋",
        mother: "马皇后",
        name: "朱元章",
        childrens: [
         {
            parent: "朱棣",
            mother: "朱棣老婆",
            name: "李善长1",
            childrens:[
                {
                    parent: "朱元璋",
                    mother: "马皇后",
                    name: "胡惟庸",
                    childrens:[
                        {
                            parent: "朱元璋",
                            mother: "马皇后",
                            name: "徐达"
                        },{
                            parent: "朱元璋",
                            mother: "马皇后",
                            name: "常茂"
                        },
                        {
                            parent: "朱元璋",
                            mother: "马皇后",
                            name: "邓愈"
                        }
                    ]
                },
                {
                                    parent: "朱元璋3",
                                    mother: "马皇后",
                                    name: "耿再成"
                                },{
                                    parent: "朱元璋3",
                                    mother: "马皇后",
                                    name: "耿再成"
                                },{
                                    parent: "朱元璋3",
                                    mother: "马皇后",
                                    name: "耿再成"
                                },
                {
                    parent: "朱元璋",
                    mother: "马皇后",
                    name: "冯胜",
                    childrens:[
                                {
                                    parent: "朱元璋",
                                    mother: "马皇后",
                                    name: "李文忠"
                                },{
                                    parent: "朱元璋",
                                    mother: "马皇后",
                                    name: "李善长"
                                },{
                                    parent: "朱元璋",
                                    mother: "马皇后",
                                    name: "李善长"
                                },{
                                    parent: "朱元璋",
                                    mother: "马皇后",
                                    name: "李善长"
                                },
                                {
                                    parent: "朱元璋",
                                    mother: "马皇后",
                                    name: "汤和"
                                }
                            ]
                },
                {
                    parent: "朱元璋",
                    mother: "马皇后",
                    name: "朱棣朱棣棣朱朱棣",
                    childrens:[
                                {
                                    parent: "朱元璋",
                                    mother: "马皇后",
                                    name: "蓝玉"
                                },{
                                    parent: "朱元璋",
                                    mother: "马皇后",
                                    name: "傅友德"
                                },
                                {
                                    parent: "朱元璋",
                                    mother: "马皇后",
                                    name: "康茂才"
                                }
                            ]
                }
            ]
        },
        {
            parent: "朱棣",
            mother: "朱棣老婆",
            name: "金朝兴",
            childrens:[
                {
                    parent: "朱元璋",
                    mother: "马皇后",
                    name: "郭英",
                    childrens:[
                        {
                            parent: "朱元璋",
                            mother: "马皇后",
                            name: "丁德兴"
                        },{
                            parent: "朱元璋",
                            mother: "马皇后",
                            name: "冯国用"
                        },
                        {
                            parent: "朱元璋",
                            mother: "马皇后",
                            name: "朱元璋"
                        }
                    ]
                }
            ]
        }]
    }
    */