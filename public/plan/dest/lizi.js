plan.addFrag("index",{
            model:function(context){
                return {
                    dd:"url:public/etpl/etpl.js"
                }
            },
            view:"index",
            main:"main1",
            onrender:function(context){
                var task = plan.createTask();
                task.addTask(function(defer){
                    plan.callFrag("index1").then(function(){
                        defer.resolve();
                    });
                });
                task.addTask(function(defer){
                    plan.callFrag("index2").then(function(){
                        defer.resolve();
                    });
                });
                task.start();
                return task;
            }
        });
        plan.addFrag("index1",{
            model:function(context){
                return {
                    dd:"url:public/etpl/etpl.js"
                }
            },
            view:"index",
            main:"main2",
            onrender:function(context){
                console.log(context);
                var task = plan.createTask();
                task.addTask(function(defer){
                    setTimeout(function(){
                        console.log("2222222222222");
                        defer.resolve();
                    },1000);
                });
                task.start();
                return task;
            }
        });
        plan.addFrag("index2",{
            model:function(context){
                return {
                    dd:"url:public/etpl/etpl.js"
                }
            },
            view:"index",
            main:"main3",
            onrender:function(context){
                console.log(context);
            }
        });