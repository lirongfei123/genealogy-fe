define(function () {
    var CookieUtil = {
        getItem: function (name) {
            var cookieName = encodeURIComponent(name) + "=",
                cookieStart = document.cookie.indexOf(cookieName),
                cookieValue = null,
                cookieEnd;
            if (cookieStart > -1) {
                cookieEnd = document.cookie.indexOf(";", cookieStart);
                if (cookieEnd === -1) {
                    cookieEnd = document.cookie.length;
                }
                cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
            }
            return cookieValue;
        },
        setItem: function (name, value, time) {
            var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
            var date = new Date();
            cookieText += "; path=/";
            if (time) {
                date.setTime(date.getTime() + parseInt(time) * 3600000);
                cookieText += "; expires=" + date.toGMTString();
            }
            document.cookie = cookieText;
        },
        removeItem: function (name) {
            this.setItem(name, "", "-100000000");
        }
    };
    return CookieUtil;
});
