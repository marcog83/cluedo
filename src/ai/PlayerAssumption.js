/**
 * Created by marco.gobbi on 02/02/2015.
 */
define(function (require) {
	"use strict";
	var CNF = require("./CNF");
	var Clause = require("./Clause");
	var Literal = require("./Literal");
	var Signal = require("signals");
	var bw = require("../bitwise/bw");

	function PlayerAssumption(player, cards) {
		this.player = player;
		this.onCertainAdded = new Signal();
		this.possibleHandCards = cards;
		this.certainHandCards = 0;
		this.kb = new CNF();
	}

	PlayerAssumption.prototype = {
		removePossibleCard: function (card, emit) {
			if (!(this.possibleHandCards & card)
				|| (this.certainHandCards & card)) {
				return; // Already added / not possible
			}
			//elimina la card
			this.possibleHandCards &= ~card;
			////
			this.kb.addNewFact(card, false);
			var facts = this.kb.getNewFacts();
			var alreadyAddedFacts = [];
			while (facts.length) {
				var l = facts.shift();
				if (l.sign && (alreadyAddedFacts.indexOf(l) == -1)) {
					// we have found new certain hand card
					this.addCertainHandCard(l.value);
					alreadyAddedFacts.push(l);
					facts = _.union(facts, this.kb.getNewFacts());
				}
			}
		},
		addCertainHandCard: function (card) {
			this.certainHandCards |= card;
			this.possibleHandCards &= ~card;
			this.notifyObservers(card);
			var _hand = _.compact(bw.numToBinaryArray(this.player.hand)).length;
			var _certainHandCards = _.compact(bw.numToBinaryArray(this.certainHandCards)).length;
			if (_hand == _certainHandCards) {
				this.possibleHandCards = 0;
				//
			}
			this.kb.addNewFact(card, true);
		},
		/**
		 * This method is called whenever a certain card is added somewhere else.
		 * We can then exclude this card from our possible cards pool.
		 *
		 */
		update: function (card) {
			this.removePossibleCard(card, true);
		},
		notifyObservers: function (card, emit) {
			if (!emit) {
				this.onCertainAdded.emit(card, false, this);
			}
		},
		/**
		 * Call this method when the subjected player answered a suggestion hidden
		 * from the AI player. It will add a suitable clause to the knowledge base
		 * if none of the cards in the suggestion are in the certain hand cards.
		 *
		 * @param suggestion suggestion to add

		 */
		addAnsweredSuggestion: function (suggestion) {
			var clause = new Clause();
			var cards = suggestion.suspect | suggestion.room | suggestion.weapon;
			/*console.log("c",bw.numToBinaryArray(cards));
			 cards = bw.contains(cards, ~this.certainHandCards);

			 console.log("y",bw.numToBinaryArray(this.certainHandCards));
			 console.log("r",bw.numToBinaryArray(cards));*/
			//cards = bw.contains(cards, this.possibleHandCards);
			if (!(cards & this.certainHandCards)) {
				// var binary = utils.numToBinaryArray(cards);
				if (this.possibleHandCards & suggestion.suspect) {
					clause.addLiteral(suggestion.suspect, true);
				}
				if (this.possibleHandCards & suggestion.room) {
					clause.addLiteral(suggestion.room, true);
				}
				if (this.possibleHandCards & suggestion.weapon) {
					clause.addLiteral(suggestion.weapon, true);
				}
				if (clause.literals.length == 1) { // New certain hand card
					this.addCertainHandCard(clause.literals[0].value);
				} else if (!clause.isEmpty()) { // New clause
					this.kb.addClause(clause);
				}
			}
		}
	};
	return PlayerAssumption;
});