define(function (require, exports, module) {
	'use strict';
	var Dice = require("./Dice");
	var Board = require("./Board");
	var Room = require("../card/Room");
	var Weapon = require("../card/Weapon");
	var Suspect = require("../card/Suspect");
	var Point = require("../utils/Point");
	var utils = require("../utils/utils");

	function Cluedo() {
		this.dice = new Dice();
		this.initWeapons();
		this.initSuspects();
		this.initRooms();
		this.newGame();
	}

	Cluedo.players = [];
	Cluedo.weapons = [];
	Cluedo.suspects = [];
	Cluedo.rooms = [];
	Cluedo.solution = [];
	Cluedo.board = null;
	Cluedo.finished = false;
	Cluedo.prototype = {
		initWeapons: function () {
			Cluedo.weapons = [];
			Cluedo.weapons.push(Weapon.ROPE);
			Cluedo.weapons.push(Weapon.CANDLESTICK);
			Cluedo.weapons.push(Weapon.KNIFE);
			Cluedo.weapons.push(Weapon.PISTOL);
			Cluedo.weapons.push(Weapon.BAT);
			Cluedo.weapons.push(Weapon.DUMBBELL);
			Cluedo.weapons.push(Weapon.POISON);
			Cluedo.weapons.push(Weapon.TROPHY);
			Cluedo.weapons.push(Weapon.AXE);
		},
		initSuspects: function () {
			Cluedo.suspects = [];
			Cluedo.suspects.push(Suspect.PLUM);
			Suspect.PLUM.setLocation(new Point(20, 0));
			Cluedo.suspects.push(Suspect.SCARLETT);
			Suspect.SCARLETT.setLocation(new Point(18, 28));
			Cluedo.suspects.push(Suspect.WHITE);
			Suspect.WHITE.setLocation(new Point(0, 19));
			Cluedo.suspects.push(Suspect.GREEN);
			Suspect.GREEN.setLocation(new Point(0, 9));
			Cluedo.suspects.push(Suspect.PEACOCK);
			Suspect.PEACOCK.setLocation(new Point(6, 0));
			Cluedo.suspects.push(Suspect.MUSTARD);
			Suspect.MUSTARD.setLocation(new Point(7, 28));
		},
		initRooms: function () {
			Cluedo.rooms = [];
			Cluedo.rooms.push(Room.SPA);
			Cluedo.rooms.push(Room.THEATRE);
			Cluedo.rooms.push(Room.LIVING);
			Cluedo.rooms.push(Room.OBSERVATORY);
			Cluedo.rooms.push(Room.PATIO);
			Cluedo.rooms.push(Room.POOL);
			Cluedo.rooms.push(Room.HALL);
			Cluedo.rooms.push(Room.KITCHEN);
			Cluedo.rooms.push(Room.DINING);
			Cluedo.rooms.push(Room.GUEST);
		},
		newGame: function () {
			Cluedo.players = [];
			Cluedo.cards = Cluedo.weapons.concat(Cluedo.suspects, Cluedo.rooms);
			Cluedo.board = new Board();
		},
		prepareCards: function () {
			var weapons = utils.shuffle(Cluedo.weapons.slice(0));
			var suspects = utils.shuffle(Cluedo.suspects.slice(0));
			var rooms = utils.shuffle(Cluedo.rooms.slice(0));
			_.remove(rooms, Room.POOL)
			var solution = [];
			solution.push(weapons[0]);
			solution.push(suspects[0]);
			solution.push(rooms[0]);
			Cluedo.solution = solution;
			window.sol = solution;
			weapons = utils.shuffle(weapons);
			suspects = utils.shuffle(suspects);
			rooms = utils.shuffle(rooms);
			this.dealHands(weapons, rooms, suspects);
		},
		dealHands: function (weapons, rooms, suspects) {
			var deck = [].concat(suspects, weapons, rooms);
			Cluedo.solution.forEach(function (card) {
				_.remove(deck, card);
			});
			utils.shuffle(deck);
			var handSize = Math.round(deck.length / Cluedo.players.length);
			Cluedo.players.forEach(function (player, i, array) {
				var to = (i * handSize + handSize) > deck.length ? deck.length : (i * handSize + handSize);
				var hand = deck.slice(i * handSize, to);
				player.setHand(hand);
			}.bind(this))
		}
	};
	module.exports = Cluedo;
})
;