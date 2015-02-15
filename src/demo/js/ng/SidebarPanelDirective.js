define(function (require, exports, module) {
    'use strict';
    var CardsMap = require("../CharacterMap");

    function SidebarPanelDirective(model) {
        function SidebarPanel($scope) {
            this.$scope = $scope;
            this.model = $scope.model=model;

            $scope.getCharacterName = this.getCharacterName.bind(this);
        }

        SidebarPanel.prototype = {
            getCharacterName: function (id) {
                return CardsMap[id].label.toLowerCase();
            }
        };

        return {
            restrict: "EA",
            scope: {},
            link: function ($scope) {
                new SidebarPanel($scope);
            },

            templateUrl: "partials/side-bar-panel.html"
        }
    }

    module.exports = ["gameModel",SidebarPanelDirective];
});