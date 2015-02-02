define(function (require, exports, module) {
	'use strict';
	var EvidenceSheet = require("./EvidenceSheet");
	var Cluedo = require("./Cluedo");
	var ToRoom = require("./ToRoom");
	var ToSquare = require("./ToSquare");
	var Room = require("../card/Room");
	var utils = require("../utils/utils");

	function Player(character) {
		this.character = character;
		this.inGame = true;
	}

	Player.prototype = {
		setHand: function (hand) {
			this.hand = hand;
			this.evidenceSheet = new EvidenceSheet();
			this.hand.forEach(function (card) {
				this.evidenceSheet.seeCard(card);
			}.bind(this));
		},
		reviewEvidenceSheet: function () {
			this.evidenceSheet.suspects.forEach(function (s) {
				console.log("The murderer could have been " + s);
			});
			this.evidenceSheet.weapons.forEach(function (w) {
				console.log("The murder weapon could have been the " + w);
			});
			this.evidenceSheet.rooms.forEach(function (r) {
				if (r != Room.POOL) {
					console.log("The location could have been the " + r);
				}
			});
			console.log("Your hand: ");
			this.hand.forEach(function (card) {
				console.log(c.toString() + ". ");
			}.bind(this));
		},
		moveToRoom: function (string) {
			var room = Cluedo.rooms.filter(function (room) {
				return room.name == string;
			})[0];
			if (room) {
				new ToRoom(this, room);
			}
		},
		ask: function (w, s, r) {
			this.hand = utils.shuffle(this.hand);
			return _.find(this.hand, function (c) {
				return c == w || c == s || c == r
			});
		},
		moveToSquare: function (point) {
			new ToSquare(this, point);
		},
		eliminate: function () {
			this.inGame = false;
		},
		toString: function () {
			return "Player " + (Cluedo.players.indexOf(this) + 1);
		}
	};
	module.exports = Player;
});