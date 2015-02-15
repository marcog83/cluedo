define(function (require, exports, module) {
    'use strict';
    function SuggestionPanelDirective(gameModel, gamePlay, $rootScope) {
        function SuggestionPanel($scope, $element) {
            this.game = gamePlay;
            this.element = $element;
            this.model = $scope.model = gameModel;
            this.$scope = $scope;
            $scope.status = {
                show: false
            };
            this.$scope.hide = this.hide.bind(this);
            $rootScope.$on("moved", this.handleTurnCompleted.bind(this));
            $rootScope.$on("win", this.handleWin.bind(this));
            // this.game.onTurnCompleted.connect(this.handleTurnCompleted, this);
            // this.game.onWin.connect(this.handleWin, this);
            TweenMax.set(this.element, {y: -300,autoAlpha: 0});
        }

        SuggestionPanel.prototype = {
            handleWin: function (player, accusation) {
                // this.$scope.$apply(function () {
                TweenMax.fromTo(this.element, 1, {autoAlpha: 0}, {autoAlpha: 1});
                //this.$scope.status.show = true;

                //  }.bind(this));
            },
            handleTurnCompleted: function (__,data) {

                TweenMax.fromTo(this.element, 1, {y: -300, autoAlpha: 0},

                    {
                        y: 0,
                        autoAlpha: 1,
                        ease: Expo.easeInOut,
                        delay:data.time
                    });

            },
            hide: function () {
                TweenMax.to(this.element, 1, {autoAlpha: 0});

            }
        };

        return {
            restrict: "EA",
            scope: {},
            link: function ($scope, $element) {
                new SuggestionPanel($scope, $element);
            },
            templateUrl: "partials/suggestion-panel.html"
        }
    }

    module.exports = ["gameModel", "gamePlay", '$rootScope', SuggestionPanelDirective];
})
;