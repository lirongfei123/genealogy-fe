window.plan = {};
define(['./utils', './route', './promise', './taskQueue', './frag'], function(require, exports, module) {
    function bootstrap() {
    	var route;
    	if(location.hash === ''){
    		var route = document.body.getAttribute('default-route');
    	}
        plan.redirect(route);
    }
    plan.bootstrap = bootstrap;
});
