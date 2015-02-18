define(function (require) {
    var angular = require("angular");
    var StartGame = require("./ng/StartGameDirective");
    var Game = require("./ng/GameDirective");
    var SidebarPanel = require("./ng/SidebarPanelDirective");
    var ToolbarDirective = require("./ng/ToolbarDirective");
    var SuggestionPanelDirective = require("./ng/SuggestionPanelDirective");
    var GameModel = require("./ng/GameModel");
    var RouteProvider = require("./ng/RouteProvider");
    var GamePlayProvider = require("./ng/GamePlayProvider");
    var PlayerThumbnailDirective = require("./ng/PlayerThumbnailDirective");
    require("angular-ui-router");
    require('angular-animate');

    return {
        main: function () {
            var NAME = "Cluedo";
            var app = angular.module(NAME, ["ui.router", 'ngAnimate']);
            app.config(RouteProvider);
            app.service("gameModel", GameModel);
            app.provider("gamePlay", GamePlayProvider);
            app.directive("startGame", StartGame);
            app.directive("gamePanel", Game);
            app.directive("sideBarPanel", SidebarPanel);
            app.directive("toolbar", ToolbarDirective);
            app.directive("suggestionPanel", SuggestionPanelDirective);
            app.directive("playerThumbnail", PlayerThumbnailDirective);
            angular.bootstrap(document, [NAME]);
        }
    }
});