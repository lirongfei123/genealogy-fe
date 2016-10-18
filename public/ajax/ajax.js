define(['module/url/url','module/utils/utils'], function(urlUtil, util) {
    var crossAjax = (function() {
        function createCorsRequiest() {
            var xhr = new XMLHttpRequest();
            if (!("withCredentials" in xhr)) {
                xhr = new XDomainRequest();
            }
            return xhr;
        }
        return {
            get: function(url, params, callback) {
                var xhr = createCorsRequiest();
                xhr.onload = function() {
                    callback && callback(xhr.responseText);
                };
                xhr.open("get", url + urlUtil.jsonToGet(url, params));
                xhr.send(null);
            }
        };
    }());
    var ajax = (function() {
        /*
        httpParams = {
            url: url地址
            params: get参数 
            data: post 数据
            success: 回调函数
        }
        */
        //ajax请求

        var li_ajax = {
            get: function(httpParams) {
                var type = httpParams.type || false,
                    params = httpParams.params || {},
                    url = httpParams.url,
                    paramsStr = urlUtil.jsonToGet(url, params),
                    url = url + paramsStr,
                    callback = httpParams.success || util.blank;

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                            try {
                                var ajaxData = JSON.parse(xhr.responseText);
                                callback(ajaxData);
                            }catch(e){
                                console.error(e);
                                callback(xhr.responseText);
                            }
                            
                        }
                    }
                }
                xhr.open("get", url, type)
                xhr.send(null);
                return xhr;
            },
            post: function(httpParams) {
                var type = httpParams.type || false,
                    params = httpParams.params || {},
                    data = httpParams.data || {},
                    url = httpParams.url,
                    paramsStr = urlUtil.jsonToGet(url, params),
                    dataStr = urlUtil.jsonToGet(data),
                    url = url + paramsStr,
                    callback = httpParams.success || util.blank;
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                            try {
                                var ajaxData = JSON.parse(xhr.responseText);
                                callback(ajaxData);
                            }catch(e){
                                console.error(e);
                                callback(xhr.responseText);
                            }
                        }
                    }
                }
                xhr.open("post", url, type)
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send(dataStr);
                return xhr;
            }
        };
        return li_ajax;
    }());
    return {
        crossAjax: crossAjax,
        ajax: ajax
    };
});
