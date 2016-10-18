define(function(require,exports,module){
    /**
     *@decription 自定义事件容器
     */
    function Event_Target(){
        this.handlers=new Object();
        Event_Target.prototype.constructor=Event_Target;
        //添加事件方法
        if(typeof this.bind!="function"){
            Event_Target.prototype.bind=function(type,handler){
                if(typeof this.handlers[type] == "undefined"){
                    this.handlers[type]=new Array();
                }
                this.handlers[type].push(handler);
            }
        }
        //添加事件方法
        if(typeof this.fire!="function"){
            Event_Target.prototype.fire=function(type,event){
                if(!event) event={};
                if(!event.target){
                    event.target=this;
                }
                if(this.handlers[type] instanceof Array){
                    var handlers=this.handlers[type];
                    for(var i=0,len=handlers.length;i<len;i++){
                        handlers[i](event);
                    }
                }
            }
        }
        //移除事件方法
        if(typeof this.unbind!="function"){
            Event_Target.prototype.unbind=function(type,handler){
                if(this.handlers[type] instanceof Array){
                    var handlers=this.handlers[type];
                    for(var i=0,len=handlers.length;i<len;i++){
                        if(handlers[i]==handler){
                            break;
                        }
                    }
                    handlers.splice(i,1);
                }
            }
        }
    }
    module.exports=Event_Target;
});
