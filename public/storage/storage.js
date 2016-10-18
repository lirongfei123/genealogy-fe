define(function (require) {
    // JavaScript Document
    /*
    author:李荣飞-成都信息工程学院
    getItem:得到值
    setItem:设置值
    removeItem:移除值
    */

    var locStorage = function () {
        var UserData = {
            userData: null,
            name: location.hostname,
            //this.name = "css88.com";
            init: function () {
                if (!UserData.userData) {
                    try {
                        UserData.userData = document.createElement('INPUT');
                        UserData.userData.type = "hidden";
                        UserData.userData.style.display = "none";
                        UserData.userData.addBehavior("#default#userData");
                        document.body.appendChild(UserData.userData);
                        var expires = new Date();
                        expires.setDate(expires.getDate() + 365);
                        UserData.userData.expires = expires.toUTCString();
                    } catch (e) {
                        return false;
                    }
                }
                return true;
            },
            setItem: function (key, value) {
                if (UserData.init()) {
                    UserData.userData.load(UserData.name);
                    UserData.userData.setAttribute(key, value);
                    UserData.userData.save(UserData.name);
                }
            },
            getItem: function (key) {
                if (UserData.init()) {
                    UserData.userData.load(UserData.name);
                    return UserData.userData.getAttribute(key)
                }
            },
            removeItem: function (key) {
                if (UserData.init()) {
                    UserData.userData.load(UserData.name);
                    UserData.userData.removeAttribute(key);
                    UserData.userData.save(UserData.name);
                }

            }
        };
        var _locStorage = null;
        if (typeof localStorage == "object") {
            _locStorage = localStorage;
        } else {
            _locStorage = UserData;
        }
        return {
            setItem: function (map, value) {
                if (typeof value != "undefined") {
                    _locStorage.setItem(map, value);
                } else if (typeof map === "object") {
                    for (var i in map) {
                        _locStorage.setItem(i, map[i]);
                    }
                }
            },
            getItem: function (key) {
                return _locStorage.getItem(key);
            },
            removeItem: function (keys) {
                if (typeof keys == "string") {
                    keys = [keys];
                }
                for (var i = 0, len = keys.length; i < len; i++) {
                    _locStorage.removeItem(keys[i]);
                }
            }
        }
    }();
    return locStorage;
});
