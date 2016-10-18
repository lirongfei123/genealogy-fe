define(["module/cookie/cookie", 
    "module/jsonp/jsonp", 
    "module/utils/utils", 
    "module/url/url",
    "module/storage/storage"], function (cookie, jsonp, util,urlUtil,storage) {
    if (!(ssoUtil&&ssoUtil.appid)) {
        return;
    }
    ssoJsonpCallback.verifyError=function () {
        console.log("验证失败");
    }
    return {
        checkLogin: function (callback) {
            //检查是否登录，并执行回调函数
            var successCallback = (callback && callback.success) || util.blank;
            var errorCallback = (callback && callback.error) || util.blank;
            if (cookie.getItem("ssoToken")) {
                successCallback();
            } else {
                errorCallback();
            }
        },
        login: function (redirecturl,params) {
            params = util.extend({
                login_type:"sso",
                appid:ssoUtil.appid,
                redirecturl:(redirecturl || location.href)
            }, params);
            location.href=ssoUtil.ssoUrl + "?user!user#/login"+urlUtil.jsonToGet("url", params);
        },
        loginout: function () {
            cookie.removeItem("ssoToken");
            storage.removeItem("nativeUserCreate");
        },
        getUserInfo: function (callback) {
            var tempFuncName = ssoUtil.getCallBackId();
            ssoJsonpCallback[tempFuncName] = function (jsonpData) {
                callback(jsonpData);
            }
            jsonp.get(ssoUtil.ssoUrl + "?sso!getUserInfo", {
                appid: ssoUtil.appid,
                token: cookie.getItem("ssoToken")
            }, tempFuncName);
        }
    };
});