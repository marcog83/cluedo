/**
 * Created by marco.gobbi on 02/02/2015.
 */
define(function (require) {
	"use strict";
	var SearchSpace = require("./SearchSpace");
	var Clause = require("./Clause");
	var PlayerAssumption = require("./PlayerAssumption");
	var Suggestion = require("../game/Suggestion");
	var Cluedo = require("../game/Cluedo");
	var Room = require("../card/Room");
	var utils = require("../utils/utils");

	function AIPlayer() {
		this.shownCards = {};
		this.assumptions = [];
		this.hand = 0;
		this.searchSpace = new SearchSpace();
	}

	AIPlayer.prototype = {
		getSearchSpace: function () {
			return this.searchSpace;
		},
		setHand: function () {
			var binary = utils.numToBinaryArray(this.hand);
			console.log(this.cPlayer.toString(), "=> I received cards", binary);
			this.assumptions = [];
			var otherPlayers = Cluedo.players.filter(function (player) {return player != this.cPlayer}.bind(this));

			//
			otherPlayers.forEach(function (player) {
				this.assumptions.push(new PlayerAssumption(player));
				var tmpHM = {};
				binary.forEach(function (value, index) {
					if (value === 1) {
						value = 1 << (binary.length-1-index);
						tmpHM[value] = false;
					}
				});
				this.shownCards[player] = tmpHM;
			}.bind(this));

			binary.forEach(function (value, index) {
				var card;
				if (value === 1) {
					card = 1 << (binary.length-1-index);
					this.searchSpace.update(card);
					this.assumptions.forEach(function (assumption) {
						assumption.update(card);
					}.bind(this));
				}
			}.bind(this));
			this.assumptions.forEach(function (assumption) {
				assumption.onCertainAdded.connect(this.observeAssumption.bind(this));
				// Object.observe(assumption.certainHandCards, this.observeAssumption.bind(this));
			}.bind(this));
			this.searchSpace.onChanged.connect(function (card) {
				this.assumptions.forEach(function (assumption) {
					assumption.update(card);
				});
			}.bind(this));
			/**/
		},
		observeAssumption: function (card) {
			this.searchSpace.update(card);
			this.assumptions.forEach(function (assumption) {
				assumption.update(card);
			});
		},
		inHand: function (card) {
			return (this.hand & card)==card;
		},
		ask: function (questionair, suggestion) {
			this.shownCards[questionair] = this.shownCards[questionair] || {};
			var card = null;
			if (this.hand & suggestion.suspect) {
				this.shownCards[questionair][suggestion.suspect] = true;
				card = suggestion.suspect;
			}
			if (this.hand & suggestion.weapon) {
				this.shownCards[questionair][suggestion.weapon] = true;
				card = suggestion.weapon;
			}
			if (this.hand & suggestion.room) {
				this.shownCards[questionair][suggestion.room] = true;
				card = suggestion.room;
			}
			return card;
		},
		eliminate: function () {
			this.inGame = false;
		},
		seeCard: function (suggestion, card, answerer, _couldNotAnswer) {
			this.couldNotAnswer(suggestion, _couldNotAnswer);
			var pa = this.getPlayerAssumption(answerer);
			pa.addCertainHandCard(card);
		},
		couldNotAnswer: function (suggestion, couldNotAnswer) {
			couldNotAnswer
				.filter(function (player) {
					return player != this.cPlayer
				}.bind(this))
				.forEach(function (player, i) {
					var pa = this.getPlayerAssumption(player);
					pa.removePossibleCard(suggestion.suspect);
					pa.removePossibleCard(suggestion.room);
					pa.removePossibleCard(suggestion.weapon);
				}.bind(this));
		},
		getPlayerAssumption: function (player) {
			return this.assumptions.filter(function (pa) {
				return pa.player == player;
			})[0];
		},
		suggest: function (player) {
			var cards = this.searchSpace.getPossibleCards();
			var suggestion = new Suggestion(player);
			suggestion.suspect = this.searchSpace.getSolutionPerson();
			suggestion.weapon = this.searchSpace.getSolutionWeapon();
			suggestion.room = this.searchSpace.getSolutionRoom();
			console.log(player.toString(), " vai in", this.searchSpace.getSolutionRoom(), "!");
			console.log(player.toString(), "=>", [
				suggestion.suspect,
				suggestion.weapon,
				suggestion.room
			]);
			return Promise.resolve(suggestion);
		},
		getRanks: function () {
			var cards = this.searchSpace.getPossibleCards();
			var ranks = cards.reduce(function (result, card) {
				result[card] = 1;
				return result;
			}, {});
		},
		/**
		 * This method is called when a player show another player a card hidden from
		 * this player.
		 *
		 * @param suggestion subjected suggestion
		 * @param questionair asking player
		 * @param answerer answering player
		 * @param couldNotAnswer set of players which could not answer

		 */
		observeMove: function (suggestion, questionair, answerer, couldNotAnswer) {
			this.couldNotAnswer(suggestion, couldNotAnswer);
			if (answerer == null || this.cPlayer == answerer) { // Not interesting
				return;
			}
			var pa = this.getPlayerAssumption(answerer);
			pa.addAnsweredSuggestion(suggestion);
		},
		stayOrLeave: function (player) {
			//TODO come automatizzare scelta!!!
			var desiredRoom = this.searchSpace.getSolutionRoom();
			if (player.hasAccusation) {
				console.log(player.toString(), "=> I Know who is the Murderer!");
				desiredRoom = Room.POOL;
			}
			if (player.character.room == desiredRoom) {
				return Promise.resolve(true);
			} else {
				return Promise.reject(desiredRoom);
			}
		},
		setAccusation: function () {
			var accusation = this.searchSpace.getAccusation();
			console.log(this.cPlayer.toString(), "=> I accuse:",accusation);
			return Promise.resolve(accusation);
		}
	};
	return AIPlayer;
});