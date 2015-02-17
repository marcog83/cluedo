define(function (require, exports, module) {
    'use strict';
	var CharacterMap = require("../CharacterMap");
    function StartGameDirective(model) {
        function StartGame($scope) {

            this.$scope = $scope;
            $scope.model = model;
            this.model = model;
            $scope.addNewPlayer = this.addNewPlayer.bind(this);
	        $scope.getName=function(player){
		        return CharacterMap[player.character].label
	        }

        }

        StartGame.prototype = {

            addNewPlayer: function () {
                this.model.addNewPlayer();
            }
        };

        return {
            restrict: "EA",
            scope: {},
            link: function ($scope) {
                new StartGame($scope);
            },
            templateUrl: "partials/start-game.html"
        }
    }

    module.exports = ["gameModel", StartGameDirective];
});