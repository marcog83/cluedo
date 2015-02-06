/**
 * Created by marco.gobbi on 03/02/2015.
 */
// Help Node out by setting up define.
if (typeof exports === 'object' && typeof define !== 'function') {
    var define = function (factory) {
        factory(require, exports, module);
    };
}
define(function (require, exports, module) {
    "use strict";

    var bw = require("../bitwise/bw");
    var Game = require("../game/GamePlay");
    module.exports = {
        main: function () {
            var game = new Game();

            //
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