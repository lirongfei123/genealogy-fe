define(function () {
    return {
        loadTemplate: function (templte_func) {
            var funcstr = templte_func.toString().trim(),
                reg = /\/\*([\s\S]+)\*\//,
                text = reg.exec(funcstr)[1],
                div = document.createElement("div");
            div.innerHTML = text;
            var childs = div.childNodes,
                head = document.getElementsByTagName("head")[0],
                i,
                len;
            for (i = 0, len = childs.length; i < len; i++) {
                if (childs[i] && childs[i].nodeType === 1 && childs[i].nodeName === "SCRIPT") {
                    head.appendChild(childs[i]);
                }
            }
        },
        blank: function () {
            return undefined;
        },
        getObjType: function (obj) {
            return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
        },
        extend: function (old_obj, new_obj) {
            var _this = this;

            function inner_extend(o_obj, n_obj) {
                for (var i in n_obj) {
                    if (typeof _this.getObjType(n_obj[i]) == "object") {
                        if (typeof o_obj[i] != "object") {
                            o_obj[i] = {}
                        }
                        inner_extend(o_obj[i], n_obj[i]);
                    } else {
                        o_obj[i] = n_obj[i]
                    }

                }
            }
            inner_extend(old_obj, new_obj);
            return old_obj;
        },
        windowOpen: function (url, target) {
            if (target === "_blank") {
                var ziyemian = window.open("about:blank", target);
                ziyemian.location.href = url;
            } else {
                window.open(url, target);
            }
        }
    };
});
