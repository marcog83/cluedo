require.config({
    paths: {
        signals: "../../../bower_components/js-signal-slot/Signal",
        lodash: "../../../bower_components/lodash/lodash.min",
        angular: "../bower_components/angular/angular",
        'angular-animate': "../bower_components/angular-animate/angular-animate.min",
        pathfinding: "../bower_components/pathfinding/pathfinding-browser",
        jquery: "../bower_components/jquery/dist/jquery.min",
        'angular-ui-router': "../bower_components/angular-ui-router/release/angular-ui-router"
    },
    shim: {
        angular: {
            exports: "angular",
            deps: ["jquery"]
        },
        'angular-animate': {
            deps: ["angular"]
        },
        "angular-ui-router": {
            deps: ["angular"]
        }
    }
});

require(["./Application"], function (Application) {
    Application.main();
});