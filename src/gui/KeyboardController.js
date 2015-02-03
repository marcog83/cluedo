/**
 * Created by marco.gobbi on 03/02/2015.
 */
define(function (require) {
	"use strict";
	var Point = require("../utils/Point");
	var Cluedo = require("../game/Cluedo");
	var Key = {
		E: 69,
		UP: 38,
		DOWN: 40,
		LEFT: 37,
		RIGHT: 39
	};
	function KeyboardController(game) {
		this.game = game;
	}

	KeyboardController.prototype = {
		initialize: function () {
			this.setHandlers()
		},
		setHandlers: function () {
			document.addEventListener("keyup", function (e) {
				var location = this.game.currentCharacter.location;
				if (location == null) {
					return;
				}
				switch (e.keyCode) {
					case Key.UP:
						location = new Point(location.x, location.y - 1);
						break;
					case Key.DOWN:
						location = new Point(location.x, location.y + 1);
						break;
					case Key.LEFT:
						location = new Point(location.x - 1, location.y);
						break;
					case Key.RIGHT:
						location = new Point(location.x + 1, location.y);
						break;
					case Key.E:
						var sq = Cluedo.board.squareAt(location);
						if (!sq.entrance) {
							return;
						}
						this.game.enter(sq.entrance.room);
						return;
						break;
				}
				this.game.movePlayer(location);

			}.bind(this))
		}
	};
	return KeyboardController;
});