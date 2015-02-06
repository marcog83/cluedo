var bw = require("../bitwise/bw");
var Game = require("../game/GamePlay");

var Promise = require("bluebird");
var Application = {
    main: function (results) {
        return new Promise(function (resolve) {

            var game = new Game();
            //
            game.start();
            game.onWin.connect(function (player, accusation, solution, current) {
                results.push({

                    type: "win",
                    player: player.toString(),
                    turni: current,
                    accusation: bw.numToBinaryArray(accusation).toString(),
                    solution: bw.numToBinaryArray(solution).toString()

                });
                console.log("You Win! " + player.toString());
                console.log("Your accusation =>", bw.numToBinaryArray(accusation));
                console.log("       Solution =>", bw.numToBinaryArray(solution));
                resolve(results);
            });
            game.onFailed.connect(function (player, accusation, solution, current) {
                results.push({

                    type: "fail",
                    player: player.toString(),
                    turni: current,
                    accusation: bw.numToBinaryArray(accusation).toString(),
                    solution: bw.numToBinaryArray(solution).toString()

                });
                console.log("You Failed! " + player.toString());
                console.log("Your accusation =>", bw.numToBinaryArray(accusation));
                console.log("       Solution =>", bw.numToBinaryArray(solution));

            });

        })
    }
};
module.exports = Application;