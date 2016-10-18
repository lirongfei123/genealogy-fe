define(['./promise'],function(){
    function Queue(){
        this.taskCounter = 0;
        this.promises = [];
        this.defer = plan.Q.defer();
        this.tasks = [];
        this.status = "penging";
    }
    Queue.prototype.addTask = function(task){
        var defer = plan.Q.defer();
        this.promises.push(defer.promise);
        this.tasks.push([task,defer]);
    };
    Queue.prototype.then = function(onSuccess,onError){
        return this.defer.promise.then(onSuccess,onError);
    };
    Queue.prototype.start = function(){
        var that = this;
        if(this.promises.length>0){
            plan.Q.all(this.promises).then(function(results){
                that.defer.resolve(results);
            });
            for(var i=0, ii = this.tasks.length; i < ii; i++) {
                this.tasks[i][0](this.tasks[i][1]);
            }
        }else{
            this.defer.resolve();
        }
        
    };
    function taskQueue(){
        return new Queue();
    }
    plan.createTask = taskQueue;
});
