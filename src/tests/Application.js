/**
 * Created by marco.gobbi on 03/02/2015.
 */
define(function (require) {
	"use strict";
	var GameController = require("./GameController");

	var Game = require("../game/GamePlay");

	return {
		main: function () {
			var game = new Game();
			var controller = new GameController(game);
			//
			game.start();
			game.onWin.connect(function (player,accusation,solution) {
				alertify.alert("You Win! " + player.toString(),function(){
					window.location.reload()
				});
				console.log("Your accusation =>",bw.numToBinaryArray(accusation));
				console.log("       Solution =>",bw.numToBinaryArray(solution));

			});
			game.onFailed.connect(function (player,accusation,solution) {
				alertify.alert("You Failed! " + player.toString(),function(){
					window.location.reload()
				});
				console.log("Your accusation =>",bw.numToBinaryArray(accusation));
				console.log("       Solution =>",bw.numToBinaryArray(solution));
			});

		}
	};
});