define(function (module, exports, require) {
    /**
     * @param 
     */
    function Promise() {
        this.$state = {
            status: 0
        };
    }
    Promise.prototype.then = function (onSuccess, onReject, progressBack) {
        if (isUndefined(onSuccess) && isUndefined(onReject) && isUndefined(progressBack)) {
            return this;
        }
        var defer = new Deferred();
        /*
        //如果本身promise已经执行完成了，就直接执行传入的函数
        if(this.$state.status == 1){
            onSuccess();
            return defer.promise;
        }else if(this.$state.status == 2) {
            onReject();
            return defer.promise;
        }
        */
        if (isUndefined(this.$state.pendding)) {
            this.$state.pendding = [];
        }
        this.$state.pendding.push([defer, onSuccess, onReject, progressBack]);
        return defer.promise;
    };
    Promise.prototype.catch = function (callback) {
        return this.then(null, callback);
    };
    Promise.prototype.finally = function (callback, progressBack) {
        return this.then(function(value){
            callback(value);
        }, function(value){
            callback(value);
        }, progressBack);
    };

    function Deferred() {
        this.promise = new Promise();
    }
    Deferred.prototype.resolve = function (val) {
        //如果状态是已经执行的状态，就直接返回
        if (this.promise.$state.status) return;
        if (val === this.promise) {
            throw ("不能传入自己的primise");
        }
        this.$resolve(val);
    };
    Deferred.prototype.$resolve = function (val) {
        //如果resolve传入的是一个promise
        var then,
            done = false,
            that = this;
        try {
            if (isObject(val)) {
                then = val && val.then;
            }
            if (isFunction(then)) {
                this.promise.$state.status = -1;
                then.call(val, resolve, reject, function(){
                    that.notify.call(val);
                });
            } else {
                this.promise.$state.status = 1;
                this.promise.$state.value = val;
                handlePendding(this.promise.$state);
            }
        } catch (e) {
            reject(e);
        }

        function resolve(val) {
            if (done) return;
            done = true;
            that.$resolve(val);
        }

        function reject(val) {
            if (done) return;
            done = true;
            that.$reject(val);
        }
    };
    Deferred.prototype.reject = function (val) {
        if(this.promise.$state.status) return;
        this.$reject(val);
    };
    Deferred.prototype.$reject = function (reson) {
        this.promise.$state.value = reson;
        this.promise.$state.status = 2;
        handlePendding(this.promise.$state);
    };
    Deferred.prototype.notify = function () {

    };

    function handlePendding(state) {
        var fn, defer, pendding;
        pendding = state.pendding;
        for (var i = 0, ii = pendding.length; i < ii; i++) {
            defer = pendding[i][0];
            fn = pendding[i][state.status];
            try {
                if (isFunction(fn)) {
                    defer.resolve(fn(state.value));
                } else if (state.status == 1) {
                    defer.resolve(state.value);
                } else {
                    defer.reject(state.value);
                }
            } catch (e) {
                defer.reject(e);
            }
        }
    }

    function defer() {
        return new Deferred();
    }

    function when(promise) {

    }

    function all(promises) {
        var defer = new Deferred(),
            counter = 0,
            results = [];
        for(var i=0,ii=promises.length; i<ii; i++) {
            var promise = promises[i];
            counter++;
            (function(key){
                promise.then(function(value){
                    if(!results.hasOwnProperty(key)) {
                        results[key] = value;
                    }
                    if(!(--counter)) defer.resolve(results);
                },function(value){
                    defer.reject(value);
                });
            })(i);
        }
        if(counter === 0) defer.resolve(results);
        return defer.promise;
    }

    function isUndefined(variable) {
        return typeof variable === 'undefined';
    }

    function isObject(val) {
        return val !== null && typeof val === 'object';
    }

    function isFunction(val) {
        return typeof val === 'function';
    }
    plan.Q = {
        defer: defer,
        when: when,
        all: all
    };
});
