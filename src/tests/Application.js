/**
 * Created by marco.gobbi on 03/02/2015.
 */
define(function (require) {
	"use strict";
	var GameController = require("./GameController");
	var Game = require("../gui/Game");
	return {
		main: function () {
			var game = new Game();
			var controller = new GameController(game);
			//
			game.start();
			game.onWin.connect(function (player) {
				alert("You Win! " + player.toString());
			});
			game.onFailed.connect(function (player) {
				alert("You Failed! " + player.toString());
			});
		}
	};
});