define(["module/url/url"], function (urlUtil) {
    return {
        get: function (url, params, callbackname) {
            if (!callbackname) {
                var temp = params;
                params = {};
                params.jsonpcallback = temp;
            } else {
                params.jsonpcallback = callbackname;
            }
            var head = document.getElementsByTagName("head")[0];
            var scriptNode = document.createElement("script");
            scriptNode.onload = function () {
                head.removeChild(scriptNode);
            }
            scriptNode.src = url + urlUtil.jsonToGet(url, params);
            head.appendChild(scriptNode);
        }
    };
});