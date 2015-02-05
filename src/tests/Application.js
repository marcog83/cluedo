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
			game.onWin.connect(function (player) {
				alertify.alert("You Win! " + player.toString());
			});
			game.onFailed.connect(function (player) {
				alertify.alert("You Failed! " + player.toString());
			});
		}
	};
});