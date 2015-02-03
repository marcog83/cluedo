/**
 * Created by marco.gobbi on 03/02/2015.
 */
define(function (require) {
	"use strict";
	var KeyboardController = require("./gui/KeyboardController");
	var DrawController = require("./gui/DrawController");
	var Game = require("./gui/Game");
	return {
		main: function () {
			var game = new Game();
			var drawController = new DrawController(game);
			var keycontroller = new KeyboardController(game);
			//
			keycontroller.initialize();
			drawController.initialize();
			game.start();
		}
	};
});