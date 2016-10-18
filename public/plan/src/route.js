define(["./utils"], function(utils) {
    var templateRoute = {
            beforeOne: utils.blank,
            before: utils.blank,
            action: {},
            afterOne: utils.blank,
            after: utils.blank,
            childrenRoutes: {},
            childrenRoute: childrenRoute
        },
        _OldHash = "";
    plan.routes = {};
    plan.url = url;
    /**
     * { 添加路由到plan框架 }
     *
     * @method     route
     * @param      {<string>}  routename  { 路由名称 }
     * @param      {<object>}  route      { 包括路由的前置操作，以及路由的后置操作，以及本省的action }
     * @return     {<object>}  { 返回父路由，可以像副路由添加子路由 }
     */
    var route = function(routename, route) {
        addRoute(plan.routes, routename, route);
        return route;
    };
    window.onhashchange = function(event) {
        changeRoute();
    };
    /**
     * { 改变当前路由 }
     *
     * @method     根据当前的hash至，调用对应的路由
     */
    function changeRoute() {
        var oldHash = _OldHash.substring(2),
            nowHash = location.hash.substring(2),
            context = {};
        if (oldHash === nowHash) {
            return;
        }
        _OldHash = location.hash;
        var paths = parseHash(nowHash).path.split("/"),
            oldPaths = parseHash(oldHash).path.split("/");
        oldPaths.pop();
        callRoute(plan.routes, paths, 0, null, oldPaths, context);
    }
    /**
     * { 根据传入的参数，调用对用的路由，如果传入空值，那么就根据当前hash来改变路由 }
     *
     * @method     redirect
     * @param      {string}  url     { 传入的路由值 }
     */
    function redirect(url) {
        if (typeof url !== 'undefined') {
            location.hash = '#' + url;
        }
        changeRoute();
    }
    plan.redirect = redirect;
    /**
     * { 改变url的get参数 }
     *
     * @method     search
     * @param      {<object>}  params  { get参数列表 }
     * @return     {<object>}  { 如果不传值,就返回当前的get参数 }
     */
    plan.search = function(params) {
        var currentHash = location.hash;
        var urlObjs = parseHash(currentHash);
        if (typeof params === 'undefined') {
            return urlObjs.search;
        } else {
            location.hash = createUrl(urlObjs.path, params, urlObjs.search);
        }
    };
    /**
     * { 改变当前url路径，可以传入get参数，也可以不传入，那么当前的get参数不会改变 }
     *
     * @method     path
     * @param      {<string>}  path    { url 路径 }
     * @param      {<object>}  params  { get参数 }
     * @return     {<string>}  { 如果不传值，那么就返回当前的url路径 }
     */
    plan.path = function(path, params) {
        var currentHash = location.hash;
        var urlObjs = parseHash(currentHash);
        if (typeof path === 'undefined') {
            return urlObjs.path;
        } else {
            params = params || {};
            location.hash = createUrl(path, params, urlObjs.search);
        }
    };
    plan.replace = function() {

    };
    plan.route = route;
    /**
     * {url 改变当前浏览器的url路径，并且清除get参数}
     * @param  {<string>} url    {完整的url}
     * @param  {<object>} params [get参数]
     * @return {<string>}        [如果不穿值，就返回完整的url]
     */
    function url(url, params, title) {
        if (typeof path === 'undefined') {
            return location.hash;
        } else {
            params = params || {};
            location.hash = createUrl(url, params);
        }
    }
    /**
     * [parseHash 将url格式化成路径和参数]
     * @pamam {[string]} url[url地址]
     * @return {[object]} url 对象
     */
    function parseHash(hash) {
        var splitIndex = hash.indexOf("?");
        splitIndex = splitIndex == -1 ? hash.length : splitIndex;
        var path = hash.substring(0, splitIndex),
            getparams = hash.substring(splitIndex+1);

        var tempParams = getparams.split("&"),
            params = {};

        for (var i = 0, len = tempParams.length; i < len; i++) {
            var tempParam = tempParams[i].split("=");
            params[decodeURIComponent(tempParam[0])] = decodeURIComponent(tempParam[1]);
        }
        return {
            path: path,
            search: params
        };
    }
    /**
     * [createUrl 根据path路径和get参数生成url路径]
     * @param  {[string]} path         [path路径]
     * @param  {[object]} params       [新的get参数]
     * @param  {[object]} appendParams [旧的get参数]
     * @return {[string]}              [最后的结果url]
     */
    function createUrl(path, params, appendParams) {
        if (typeof appendParams !== 'undefined') {
            utils.extend(params, appendParams);
        }
        var getparams = [];
        for (var i in params) {
            getparams.push(i + "=" + params[i]);
        }
        getparams = getparams.join("&");
        return path.indexOf("?") > -1 ? path + "&" + getparams : path + "?" + getparams;
    }
    /**
     * { 添加路由，内部方法 }
     *
     * @method     addRoute
     * @param      {<object>}  routeContainer  { 父路由的容器 }
     * @param      {<string>}  routename       { 路由名称 }
     * @param      {<object>}  route           { 路由对象 }
     */
    function addRoute(routeContainer, routename, route) {
        routeContainer[routename] = utils.extend(route, templateRoute);
    }
    /**
     * { 调用父路由添加子路由 }
     *
     * @method     childrenRoute
     * @param      {<string>}  routename  { 自路由名称 }
     * @param      {<object>}  route      { 路由对象 }
     * @return     {<object>}  { 返回当前路由 }
     */
    function childrenRoute(routename, route) {
        this.childrenRoutes[routename] = utils.extend(route, templateRoute);
        return route;
    }
    /**
     * { 调用路由 }
     *
     * @method     callRoute
     * @param      {<object>}  routeContainer  { 父路由对象 }
     * @param      {<array>}  paths           { 调用的路由队列 }
     * @param      {number}  i               { 当前是第几个 }
     * @param      {<object>}  parentRoute     { 父路由，用于调用父路由的action }
     * @param      {<array>}  oldPaths        { 就得路由队列，用于对比，如果从前项目和之前的路由队列匹配上之后，那么对应的beforeOne就不会被调用 }
     * @param      {<object>}  context         { 始终在路由队列里面传递的对象，用户保存数据 }
     */
    function callRoute(routeContainer, paths, i, parentRoute, oldPaths, context) {
        if (i == paths.length - 1) { //如果是最后一个，那就是action,直接执行
            if(utils.isUnderfine(parentRoute.action[paths[i]])) {
                throw("对不起，没有 " + paths[i] + " action");
            }
            var beforeValue = parentRoute.before();
            if (utils.isPromise(beforeValue)) {
                beforeValue.then(function(value){
                    parentRoute.action[paths[i]](value);
                });
            }else{
                parentRoute.action[paths[i]](beforeValue);
            }
            return;
        }
        var routename = paths[i],
            route = routeContainer[routename],
            beforeOneValue = null;
        // 和之前路径进行匹配，没有匹配上的话就执行beforeOne,afterOne
        if (oldPaths.slice(0, i + 1).join("/") !== paths.slice(0, i + 1).join("/")) {
            beforeOneValue = route.beforeOne(context);
        }
        if (utils.isPromise(beforeOneValue)) {
            beforeOneValue.then(function(value) {
                callRoute(route.childrenRoutes, paths, ++i, route, oldPaths, context);
            });
        } else {
            callRoute(route.childrenRoutes, paths, ++i, route, oldPaths, context);
        }
    }
});
