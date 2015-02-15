define(function (require, exports, module) {
    'use strict';
    function ToolbarDirective(gamePlay) {
        function Toolbar($scope) {
            this.$scope = $scope;
            this.game = gamePlay;
            $scope.nextPlayer = this.nextPlayer.bind(this);
        }

        Toolbar.prototype = {
            nextPlayer: function () {
                this.game.nextPlayer();
            }
        };

        return {
            restrict: "EA",
            scope: {},
            link: function ($scope) {
                new Toolbar($scope);
            },
            templateUrl:"partials/toolbar.html"
        }
    }

    module.exports = ["gamePlay", ToolbarDirective];
});