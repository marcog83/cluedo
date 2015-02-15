define(function (require, exports, module) {
    'use strict';
    var Cluedo = require("../../../game/Cluedo");
    var Cards = require("../../../bitwise/Cards");
    var Player = require("../../../game/Player");

    var AIPlayer = require("../../../ai/AIPlayer");
    var MovementController = require("../../../movement/MovementController");
    var HumanPlayer //= require("../../../human/HumanPlayer");
    var Drawer = require("./Drawer");
    var CharacterMap = require("../CharacterMap");

    function GameDirective(model, gamePlay,$rootScope,$timeout) {
        function Game($scope) {
            this.model = model;
            this.$scope = $scope;
            this.game = gamePlay;

        }

        Game.prototype = {
            initialize: function () {
                this.model.addNewPlayer(Cards.PLUM);
                this.model.addNewPlayer(Cards.GREEN);
                this.model.addNewPlayer(Cards.MUSTARD);
                this.model.addNewPlayer(Cards.PEACOCK);
                this.model.addNewPlayer(Cards.SCARLETT);
                this.model.addNewPlayer(Cards.WHITE);
                this.model.players.forEach(function (player) {
                    var controller = player.ai ? AIPlayer : HumanPlayer;
                    var config = CharacterMap[player.character];
                    config.controller = controller.create();
                    config.movement = MovementController.create({location: config.location});
                    Cluedo.players.push(new Player(config));

                });
                this.drawer = new Drawer(Cluedo.players);

                this.game.onTurnCompleted.connect(this.handleTurnCompleted, this);
                this.game.onWin.connect(this.handleWin, this);
                //this.game.onFailed.connect(this.handleFailed, this);
                //
                this.drawer.drawBoard();
                 $timeout(function(){
                    this.game.start();
                }.bind(this),250)
            },
            handleTurnCompleted: function (result) {
                this.$scope.$apply(function(){
                    this.model.setLastTurn(result);
                    this.game.currentPlayer.gotoRoom(result.suggestion.room).then(function(){
                        $rootScope.$emit("moved",{time:this.game.currentPlayer.movement.path.length*0.05});
                    }.bind(this))
                }.bind(this));

            },
            handleWin: function (player, accusation, solution) {
                this.$scope.$apply(function(){
                    this.model.setWinRecap(player,accusation);
                    $rootScope.$emit("win");
                }.bind(this));



            },
            handleFailed: function (player, accusation, solution) {

            }
        };
        return {
            restrict: "E",
            scope: {},
            link: function ($scope) {
                var game = new Game($scope);
                game.initialize();
            },
            templateUrl: "partials/game-panel.html"
        }
    }

    module.exports = ["gameModel", "gamePlay",'$rootScope','$timeout' ,GameDirective];
});