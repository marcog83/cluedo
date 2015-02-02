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

	function AIPlayer() {
		this.shownCards = {};
		this.assumptions = [];
		this.handCards = [];
		this.searchSpace = new SearchSpace();
	}

	AIPlayer.prototype = {
		getSearchSpace: function () {
			return this.searchSpace;
		},
		beginGame: function (handCards) {
			this.handCards = handCards;
			this.assumptions = [];
			var players = Cluedo.players;
			var numPlayer = players.length,
				thisPlayerPassed = false;
			var shownCards = {};
			for (var i = 0, j = 1; j < numPlayer; i = (i + 1) % numPlayer) {
				if (thisPlayerPassed) {
					this.assumptions.push(new PlayerAssumption(players[i]));
					var tmpHM = {};
					this.handCards.forEach(function (c) {
						tmpHM[c] = false;
					});
					shownCards[players[i]] = tmpHM;
					j++;
				} else if (this.player == players[i]) {
					thisPlayerPassed = true;
				}
			}
//          Player assumptions are observed by searchSpace and each other
//			Observable o = new Observable();
//			o.addObserver(searchSpace);
			//for (PlayerAssumption assumption : assumptions) {
			//	assumption.addObserver(searchSpace);
			//	o.addObserver(assumption);
			//	for (PlayerAssumption otherAssumption : assumptions) {
			//		if (otherAssumption != assumption) {
			//			assumption.addObserver(otherAssumption);
			//		}
			//	}
			//}
			//// Inform all about own hand cards
			//for (Card card : handCards) {
			//	o.notifyObservers(card);
			//}
		},
		receiveSuggestion: function (questionair, suggestion) {
			var notShownCard = null;
			if (this.handCards.indexOf(suggestion.suspect) != -1) {
				if (this.shownCards[questionair][suggestion.suspect]) {
					return suggestion.suspect;
				}
				notShownCard = suggestion.suspect;
			}
			if (this.handCards.indexOf(suggestion.weapon) != -1) {
				if (this.shownCards[questionair][suggestion.weapon]) {
					return suggestion.weapon
				}
				notShownCard = suggestion.weapon;
			}
			if (this.handCards.indexOf(suggestion.room) != -1) {
				if (this.shownCards[questionair][suggestion.room]) {
					return suggestion.room;
				}
				notShownCard = suggestion.room;
			}
			return notShownCard;
		},
		receiveAnswer: function (suggestion, card, answerer, _couldNotAnswer) {
			this.couldNotAnswer(suggestion, _couldNotAnswer);
			var pa = this.getPlayerAssumption(answerer);
			pa.addCertainHandCard(card);
		},
		couldNotAnswer: function (suggestion, couldNotAnswer) {
			couldNotAnswer.forEach(function (p, i) {
				var pa = this.getPlayerAssumption(p);
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
		play: function (player) {
			var cards = this.searchSpace.getPossibleCards();
			var suggestion = new Suggestion(player);
			suggestion.suspectListener(this.searchSpace.getSolutionPerson());
			suggestion.weaponListener(this.searchSpace.getSolutionWeapon());
			//int bestRanks[] = {-1, -1, -1}; // Dependent on Kind.size!
			var ranks = this.cards.reduce(function (result, card) {
				result[card] = 1;
				return result;
			}, {});
			var inc = this.assumptions.length + 1;
			this.assumptions.forEach(function (assumption) {
				var cnf = assumption.kb;
				var literals = cnf.getAllLiterals();
				_.forIn(literals, function (value, key) {
					var card = key;
					ranks[card] = ranks[card] + inc * value;
				});
				inc--;
			});
			_.forIn(ranks, function (rank, card) {
				//if (rank > bestRanks[card.getKind().ordinal()]) {
				//suggestion.card(card);
				//bestRanks[card.getKind().ordinal()] = rank;
				//}
			});
			return suggestion;
		},
		observeMove: function (suggestion, questionair, answerer, couldNotAnswer) {
			this.couldNotAnswer(suggestion, couldNotAnswer);
			var pa = this.getPlayerAssumption(answerer);
			var addClause = true;
			var person = suggestion.suspect;
			var room = suggestion.room;
			var weapon = suggestion.weapon;
			for (var i = 0; i < pa.certainHandCards.length; i++) {
				var c = pa.certainHandCards[i];
				if (c == person || c == room || c == weapon) {
					addClause = false;
				}
			}
			if (addClause) {
				var clause = new Clause();
				clause.addLiteral(person, true);
				clause.addLiteral(room, true);
				clause.addLiteral(weapon, true);
				pa.kb.addClause(clause);
			}
		}
	};
	return AIPlayer;
});