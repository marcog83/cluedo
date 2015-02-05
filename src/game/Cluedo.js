define(function (require, exports, module) {
	'use strict';
	var Cards = require("../bitwise/Cards");
	var Cluedo = function () {
		var NUM_CARDS = 24,
			NUM_DECK_CARDS = NUM_CARDS - 3,
			weapons = Cards.ROPE | Cards.CANDLESTICK | Cards.KNIFE | Cards.PISTOL | Cards.BAT | Cards.DUMBBELL | Cards.TROPHY | Cards.POISON | Cards.AXE,
			suspects = Cards.PLUM | Cards.SCARLETT | Cards.WHITE | Cards.GREEN | Cards.PEACOCK | Cards.MUSTARD,
			rooms = Cards.SPA | Cards.THEATRE | Cards.LIVING | Cards.OBSERVATORY | Cards.PATIO | Cards.POOL | Cards.HALL | Cards.KITCHEN | Cards.DINING | Cards.GUEST,
			cards = weapons | suspects | rooms;
		return {
			players: [],
			weapons: weapons,
			suspects: suspects,
			rooms: rooms,
			cards: cards,
			solution: 0,
			finished: false,
			prepareCards: function () {
				var leftR = ~~(Math.random() * 9);
				var leftS = ~~(Math.random() * 6) + 9;
				var leftW = ~~(Math.random() * 9) + 15;
				//
				var weapon = 1 << leftW;
				var suspect = 1 << leftS;
				var room = 1 << leftR;
				//
				var solution = weapon | suspect | room;
				//
				var deck = (weapons | suspects | rooms);
				deck &= ~weapon;
				deck &= ~suspect;
				deck &= ~room;
				Cluedo.solution = solution;
				this.dealHands(deck);
			},
			dealHands: function (deck) {
				var numPlayers = Cluedo.players.length;
				var index = 0;
				do {
					var left = ~~(Math.random() * NUM_CARDS);
					var card = 1 << left;
					if ((deck & card) == card) {
						deck &= ~card;
						//
						var who = index % numPlayers;
						Cluedo.players[who].hand |= card;
						index++;
					}
					if (deck == 0) {
						index = NUM_DECK_CARDS;
					}
				} while (index < NUM_DECK_CARDS);
				Cluedo.players.forEach(function (player) {
					player.setHand();
				});
			}
		};
	}();
	module.exports = Cluedo;
})
;