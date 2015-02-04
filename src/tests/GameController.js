/**
 * Created by marco.gobbi on 03/02/2015.
 */
define(function (require) {
	"use strict";
	var Room = require("../card/Room");

	function GameController(game) {
		$("#entra-stanza").click(function (e) {
			e.preventDefault();
 			game.enter(Room.HALL);
		});
	}

	return GameController;
});