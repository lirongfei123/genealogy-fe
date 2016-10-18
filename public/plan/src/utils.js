define(function(require, exports, module) {
    var utils = {
        extend: function(newobj, oldobj) {
            for (var i in oldobj) {
                if (!newobj.hasOwnProperty(i)) {
                    newobj[i] = oldobj[i];
                }
            }
            return newobj;
        },
        parseUrl: function(url) {
            var a = document.createElement("a");
            a.href = url;
            return {
                hash: a.hash
            };
        },
        isPromise: function(val) {
            return (val && val.constructor) && (val.constructor.name == 'Promise' || val.constructor.name == 'Queue');
        },
        isFunction: function(val) {
            return typeof val === 'function';
        },
        isString: function(val) {
            return typeof val === 'string';
        },
        isNumber: function(val) {
            return typeof val === 'number';
        },
        isUnderfine: function(val) {
            return typeof val === 'undefined';
        },
        blank: function() {}
    };
    module.exports = utils;
});
