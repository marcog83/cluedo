/**
 * Created by marco.gobbi on 02/02/2015.
 */
define(function (require) {
	"use strict";
	var Cluedo = require("../game/Cluedo");
	var CNF = require("./CNF");
	var Literal = require("./Literal");

	function PlayerAssumption(player) {
		this.player = player;
		this.possibleHandCards = [];
		this.certainHandCards = Cluedo.cards.slice(0);
		this.kb = new CNF();
	}

	PlayerAssumption.prototype = {
		removePossibleCard: function (card) {
			this.possibleHandCards = this.possibleHandCards.filter(function (pc) {
				return pc != card;
			});
			if (this.certainHandCards.length + this.possibleHandCards.length == this.player.hand.length) {
				this.certainHandCards = _.union(this.certainHandCards, this.possibleHandCards);
				this.possibleHandCards = [];
				// Notify about more cards than necessary, but otherwise we have
				// conflicts with the removal mechanism in addCertainHandCard()
				this.certainHandCards.forEach(function (certainCard) {
					this.setChanged();
					this.notifyObservers(certainCard);
				}.bind(this));
			}
			this.kb.addNewFact(new Literal(card, false));
			var facts = this.kb.getNewFacts();
			var alreadyAddedFacts = [];
			while (facts.length) {
				var l = facts.unshift();
				if (l.sign && (alreadyAddedFacts.indexOf(l) == -1)) {
					// we have found new certain hand card
					this.addCertainHandCard(l.value);
					alreadyAddedFacts.push(l);
					facts = _.union(facts, this.kb.getNewFacts());
				}
			}
		},
		addCertainHandCard: function (card) {
			if (this.possibleHandCards.indexOf(card) == -1) {
				return; // Already added / not possible
			}
			this.certainHandCards.push(card);
			_.remove(this.possibleHandCards, card);
			this.setChanged();
			this.notifyObservers(card);
			if (this.certainHandCards.length == this.player.hand.length) {
				this.possibleHandCards = [];
			}
			// remove all clauses with card = true
			this.kb.addNewFact(card, true);
		},
		/**
		 * This method is called whenever a certain card is added somewhere else.
		 * We can then exclude this card from our possible cards pool.
		 *
		 */
		update: function (card) {
			this.removePossibleCard(card);
		},
		isFullyExplored: function () {
			return !this.possibleHandCards.length;
		},
		setChanged: function () {
			//this.onChanged.dispatch();
		},
		notifyObservers: function (card) {
			//this.notifyObservers.dispatch();
		}
	};
	return PlayerAssumption;
});