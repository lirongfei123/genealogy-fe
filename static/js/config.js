var requireJsConfig = {
    baseUrl: "static/js",
    paths: {
        ltpl: '../../public/requirejs/ltpl',
        lcss: '../../public/requirejs/lcss',
        module: "../../public",
        jquery: "../../public/jquery/jquery",
    },
    urlFilter: function (url, config) {
        return url;
    }
}
