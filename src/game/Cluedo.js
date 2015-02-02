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
			this.weapons = Cluedo.weapons.slice(0);
			this.rooms = Cluedo.rooms.slice(0);
			var i = this.rooms.indexOf(Room.POOL);
			this.rooms.slice(i, 1);
			this.suspects = Cluedo.suspects.slice(0);
			Cluedo.board = new Board();
		},
		prepareCards: function () {
			this.weapons = utils.shuffle(this.weapons);
			this.suspects = utils.shuffle(this.suspects);
			this.rooms = utils.shuffle(this.rooms);
			this.solution = [];
			this.solution.push(this.weapons[0]);
			this.solution.push(this.suspects[0]);
			this.solution.push(this.rooms[0]);
			Cluedo.solution = this.solution;
			this.weapons = utils.shuffle(this.weapons);
			this.suspects = utils.shuffle(this.suspects);
			this.rooms = utils.shuffle(this.rooms);
			this.dealHands(this.weapons, this.rooms, this.suspects);
		},
		dealHands: function (weapons, rooms, suspects) {
			this.deck = [];
			this.deck = this.deck.concat(suspects.slice(0));
			this.deck = this.deck.concat(weapons.slice(0));
			this.deck = this.deck.concat(rooms.slice(0));
			this.solution.forEach(function (card) {
				var i = this.deck.indexOf(card);
				this.deck.slice(i, 1);
			}.bind(this));
			utils.shuffle(this.deck);
			this.handSize = this.deck.length / Cluedo.players.length;
			var hand;
			Cluedo.players.forEach(function (p) {
				hand = [];
				for (var i = 0; i < this.handSize; i++) {
					hand.push(this.deck.pop());
					if (this.deck.length < this.handSize) { //The last player gets the rounded up deck.
						this.hand = hand.concat(this.deck);
						break;
					}
				}
				p.setHand(hand);
			}.bind(this))
		}
	};
	Cluedo.cards = Cluedo.weapons.concat(Cluedo.suspects, Cluedo.rooms);
	module.exports = Cluedo;
})
;