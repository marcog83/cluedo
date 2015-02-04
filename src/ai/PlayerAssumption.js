/**
 * Created by marco.gobbi on 02/02/2015.
 */
define(function (require) {
    "use strict";
    var Cluedo = require("../game/Cluedo");
    var CNF = require("./CNF");
    var Clause = require("./Clause");

    var Literal = require("./Literal");
    var Signal = require("signals");
    var Room = require("../card/Room");

    function PlayerAssumption(player) {
        this.player = player;
        this.onCertainAdded = new Signal();
        this.possibleHandCards = Cluedo.cards.slice(0);
        _.remove(this.possibleHandCards, Room.POOL);
        this.certainHandCards = [];
        this.kb = new CNF();
    }

    PlayerAssumption.prototype = {
        removePossibleCard: function (card, emit) {
            this.possibleHandCards = this.possibleHandCards.filter(function (pc) {
                return pc != card;
            });
            if (this.certainHandCards.length + this.possibleHandCards.length == this.player.hand.length) {
                this.certainHandCards = this.certainHandCards.concat(this.possibleHandCards);
                //this.certainHandCards = _.union(this.certainHandCards, this.possibleHandCards);
                this.possibleHandCards = [];
                // Notify about more cards than necessary, but otherwise we have
                // conflicts with the removal mechanism in addCertainHandCard()
                this.certainHandCards.forEach(function (certainCard) {
                    this.notifyObservers(certainCard, emit);
                }.bind(this));
            }
            this.kb.addNewFact(card, false);
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
            /*if (!_.contains(this.possibleHandCards,card) || _.contains(this.certainHandCards,card)) {
             return; // Already added / not possible
             }*/
            this.certainHandCards = _.union(this.certainHandCards, [card]);
            //this.certainHandCards.push(card);

            _.remove(this.possibleHandCards, card);
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
            this.removePossibleCard(card, true);
        },
        isFullyExplored: function () {
            return !this.possibleHandCards.length;
        },
        setChanged: function () {
            //this.onChanged.dispatch();
        },
        notifyObservers: function (card, emit) {
            if (!emit)
                this.onCertainAdded.emit(card);
        },
        addAnsweredSuggestion: function (suggestion) {
            var cards = [suggestion.suspect, suggestion.room, suggestion.weapon];
            var clause = new Clause();
            _.chain(cards)
                .filter(cards, function (card) {
                    return _.contains(this.certainHandCards, card);
                }.bind(this))
                .filter(function (card) {
                    return _.contains(this.possibleHandCards, card);
                }.bind(this))
                .forEach(function (card) {
                    clause.addLiteral(card, true);
                });
            if (clause.literals.length == 1) { // New certain hand card
                this.addCertainHandCard(clause.literals[0].value);
            } else if (!clause.isEmpty()) { // New clause
                this.kb.addClause(clause);

            }
        }
    };
    return PlayerAssumption;
});