/**
 * Created by marco.gobbi on 03/02/2015.
 */
define(function (require) {
    "use strict";
    var GameController = require("./GameController");
    var MovementController = require("./MovementController");
    var bw = require("../bitwise/bw");
    var Cards = require("../bitwise/Cards");
    var AIPlayer = require("../ai/AIPlayer");
    var Game = require("../game/GamePlay");
    var Cluedo = require("../game/Cluedo");
    var Player = require("../game/Player");

    return {
        main: function () {
            var game = new Game();
            var controller = new GameController(game);
            //
            //

            Cluedo.players.push(new Player({
                id: Cards.PLUM,
                controller: AIPlayer.create(),
                movement: MovementController.create()
            }));
            Cluedo.players.push(new Player({
                id: Cards.SCARLETT,
                controller: AIPlayer.create(),
                movement: MovementController.create()
            }));
            Cluedo.players.push(new Player({
                id: Cards.WHITE,
                controller: AIPlayer.create(),
                movement: MovementController.create()
            }));
            Cluedo.players.push(new Player({
                id: Cards.GREEN,
                controller: AIPlayer.create(),
                movement: MovementController.create()
            }));
            Cluedo.players.push(new Player({
                id: Cards.PEACOCK,
                controller: AIPlayer.create(),
                movement: MovementController.create()
            }));
            Cluedo.players.push(new Player({
                id: Cards.MUSTARD,
                controller: AIPlayer.create(),
                movement: MovementController.create()
            }));

            game.start();
            game.onWin.connect(function (player, accusation, solution) {
                alertify.alert("You Win! " + player.toString(), function () {
                    window.location.reload()
                });
                console.log("Your accusation =>", bw.numToBinaryArray(accusation));
                console.log("       Solution =>", bw.numToBinaryArray(solution));

            });
            game.onFailed.connect(function (player, accusation, solution) {
                alertify.alert("You Failed! " + player.toString(), function () {
                    window.location.reload()
                });
                console.log("Your accusation =>", bw.numToBinaryArray(accusation));
                console.log("       Solution =>", bw.numToBinaryArray(solution));
            });

        }
    };
});