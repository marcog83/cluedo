/**
 * Created by marco.gobbi on 03/02/2015.
 */
define(function (require) {
	"use strict";
	var Drawer = require("./Drawer");
	var Cluedo = require("../game/Cluedo");

	function DrawController(game) {
		this.game = game;
		Drawer.init();
	}

	DrawController.prototype = {
		initialize: function () {
			this.game.onRoll.connect(this.handleMove.bind(this));
			this.game.onLeave.connect(this.handleMove.bind(this));
			this.game.onPlayerMoved.connect(this.handleMove.bind(this));
			this.game.onTurnCompleted.connect(this.handlTurnCompleted.bind(this));
		},
		handlTurnCompleted: function () {
			Drawer.draw([], []);
		},
		handleMove: function (location, roll) {
			var squares = Cluedo.board.nearbySquares(location, null, roll);
			var rooms = Cluedo.board.nearbyRooms(location, roll);
			Drawer.draw(squares, rooms, location);
		}
	};
	return DrawController;
});