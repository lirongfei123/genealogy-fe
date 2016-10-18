(function () {
    var CookieUtil = {
        setItem: function (name, value, time) {
            var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
            var date = new Date();
            cookieText += "; path=/";
            if (time) {
                date.setTime(date.getTime() + parseInt(time) * 3600000);
                cookieText += "; expires=" + date.toGMTString();
            }
            document.cookie = cookieText;
        }
    };
    //获取appid
    var scripts = document.scripts,
        script = scripts[scripts.length - 1];
    var appid = script.getAttribute("appid"),
        cookieTime = parseInt(script.getAttribute("cookie"));
    window.ssoJsonpCallback = {
        verifyError: function () {
            return null;
        }
    };
    window.ssoUtil = {};
    ssoUtil.appid = appid;
    ssoUtil.ssoUrl = "https://sso.mlife.top/index.php";
    ssoUtil.getCallBackId = function () {
        if (!ssoUtil.getCallBackId.funcid) {
            ssoUtil.getCallBackId.funcid = 0;
        }
        return "callback_" + ssoUtil.getCallBackId.funcid++;
    }
    var search = location.search,
        hasCode = /code=(\b\w+?\b)/g.exec(search);
    if (hasCode) {
        var tempCallback = ssoUtil.getCallBackId();
        ssoJsonpCallback[tempCallback] = function (token) {
            CookieUtil.setItem("ssoToken", token, cookieTime * 24);
            location.href = location.href.replace(/(?:\?|&)code=\b\w+?\b/, "");
        }
        document.write("<script type='text/javascript' src ='" + ssoUtil.ssoUrl + "?user!verifyCode&appid=" + ssoUtil.appid + "&code=" + hasCode[1] + "&jsonpcallback=" + tempCallback + "'></script>");
    }
}());

