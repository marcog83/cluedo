define(function (require, exports, module) {
    'use strict';

    function RouteProvider($stateProvider, $urlRouterProvider) {
        //
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/start-game");
        //
        // Now set up the states
        $stateProvider
            .state('start-game', {
                url: "/start-game",
                template: "<start-game></start-game>"
            })
            .state('game', {
                url: "/game",
                templateUrl: "partials/game.html"
            })

    }

    module.exports = ['$stateProvider', '$urlRouterProvider', RouteProvider];
});