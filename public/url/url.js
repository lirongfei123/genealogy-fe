define(function () {
    return {
        jsonToGet: function (url, json) {
            if(!json) {
                json = url;
                url = null;
            }
            var getResult = [],
                i;
            for (i in json) {
                if (json.hasOwnProperty(i)) {
                    getResult.push(encodeURIComponent(i) + "=" + encodeURIComponent(json[i]));
                }
            }
            if(getResult.length > 0) {
                getResult = getResult.join("&");
                if (url!==null) {
                    return url.indexOf("?") === -1 ? "?" + getResult : "&" + getResult;
                } else {
                    return getResult;
                }
                
            } else {
                return "";
            }
        },
        getParams:function(search){
            if(search==""){
                return {};
            }
            search = search.substring(1).split("&");
            var result = {};
            for(var i=0,len=search.length;i<len;i++){
                var keyValues= search[i].split("=");
                result[keyValues[0]] = keyValues.length>0?keyValues[1]:"";
            } 
            return result;
        },
        parseUrl: function (parseUrl) {
            var a = document.createElement("a");
            a.href = parseUrl;
            return {
                host: a.host,
                hostname: a.hostname,
                search: a.search,
                origin: a.origin,
                pathname: a.pathname,
                hash: a.hash
            };
        }
    };
});