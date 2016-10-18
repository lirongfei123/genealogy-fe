define(['./utils', 'module/jquery/jquery'], function(utils) {
    plan.frags = {};
    plan.addFrag = addFrag;
    plan.callFrag = callFrag;
    //把参数格式化成统一的，这样可以实现单一职责模式，因为参数接受的参数都是一样的
    var actionTemplate = {
        model: {},
        main: "",
        view: "",
        onrender: utils.blank
    };

    function addFrag(fragname, action) {
        plan.frags[fragname] = utils.extend(action, actionTemplate);
    }

    function callFrag(fragname,action) {
        //条用时候的action，可以覆盖之前的action
        var oldAction = plan.frags[fragname],
            context = {};
        if(!utils.isUnderfine(action)){
            action = utils.extend(action,oldAction);
        }else{
            action = oldAction;
        }
        var model = action.model;
        var task = getModel(model, context);
        var defer = plan.Q.defer();
        if (utils.isPromise(task)) {
            task.then(function() {
                return render(action.view, context, action.main, action.onrender);
            }).then(function(value) {
                defer.resolve(value);
            });
        } else {
            render(action.view, context, action.main, action.onrender).then(function(value) {
                defer.resolve(value);
            });
        }
        return defer.promise;
    }

    function getModel(model, context) {
        if (utils.isFunction(model)) {
            model = model(context);
        }
        if (utils.isPromise(model)) {
            return model.then(function(value){
               for(var i in value){
                context[i]=value[i];
               }
            });

        }
        var task = null;
        for (var i in model) {
            (function(key) {
                var value = model[key];
                if (utils.isString(value)) {
                    //如果是以url开头
                    if (/^url:/.test(value)) {
                        if (!task) task = plan.createTask();
                        task.addTask(function(defer) {
                            $.get(value.substring(4), function(value) {
                                context[key] = value;
                                defer.resolve(value);
                            });
                        });
                    }else{
                        context[key] = value;
                    }
                }else if (utils.isFunction(value)) {
                    context[key] = value();
                }else{
                    context[key] = value;
                }
            })(i);
        }
        if (task) {
            task.start();
            return task;
        }
    }

    function render(view, context, main, onrender) {
        if (utils.isString(main)) {
            main = document.getElementById(main);
        }
        main.innerHTML = etpl.render(view, context);
        var defer = plan.Q.defer();
        setTimeout(function() {
            var task = onrender(context);
            if (utils.isPromise(task)) {
                task.then(function(results) {
                    defer.resolve(results);
                });
            } else {
                defer.resolve(task);
            }
        }, 0);
        return defer.promise;
    }
});
