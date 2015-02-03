/**
 * Created by marco.gobbi on 03/02/2015.
 */
define(function (require) {
	"use strict";
	var Cluedo = require("../game/Cluedo");

	function GameController(game) {
		$("#entra-stanza").click(function (e) {
			e.preventDefault();
			var index = parseInt($("#room").val());
			var room = Cluedo.rooms[index];
			game.enter(room);
		});
	}

	return GameController;
});