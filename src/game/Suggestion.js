define(function (require, exports, module) {
	'use strict';
	var Cluedo = require("./Cluedo");

	function Suggestion(player) {
		this.room = player.character.room;
		this.suspect = player;
		this.weapon = player;
		this.player = player;
	}

	Suggestion.prototype = {
		suspectListener: function (name) {
			this.suspect = Cluedo.suspects.filter(function (s) {
				return s.name.toLowerCase() == name.toLowerCase();
			})[0];
		},
		weaponListener: function (name) {
			this.weapon = Cluedo.weapons.filter(function (w) {
				return w.name.toLowerCase() == name.toLowerCase();
			})[0];
		},
		callInSuspect: function () {
			if (this.suspect.inRoom) {
				this.suspect.exitRoom(null);
			} else {
				Cluedo.board.squareAt(this.suspect.location).setOccupant(null);
				this.suspect.setLocation(null);
			}
			this.suspect.enterRoom(this.room);
		},
		questionPlayers: function () {
			var index = Cluedo.players.indexOf(this.player) + 1;
			if (index == Cluedo.players.length) {
				index = 0;
			}
			var asked = Cluedo.players[index];
			var card;
			var message = "No one could help you. Interesting..";
			var couldNotAnswer = [];
			while (asked != this.player) {
				card = asked.ask(this.player, this);
				if (card) {
					this.player.seeCard(this, card, asked, couldNotAnswer);
					message = asked.toString() + " showed you =>" + card.toString();
					break;
				} else {
					couldNotAnswer.push(asked);
				}
				//Increments count, resets if exceeding player count.
				if (++index == Cluedo.players.length) {
					index = 0;
				}
				asked = Cluedo.players[index];
			}
			console.log(message);
			return card
		}
	};
	module.exports = Suggestion;
});