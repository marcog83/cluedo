/**
 * Created by marco.gobbi on 02/02/2015.
 */
define(function (require) {
    "use strict";

    var CNF = require("./CNF");
    var Clause = require("./Clause");
    var Literal = require("./Literal");
    var Signal = require("signals");

    var utils = require("../utils/utils");

    function PlayerAssumption(player,cards) {
        this.player = player;
        this.onCertainAdded = new Signal();
        this.possibleHandCards = cards;
        this.certainHandCards = 0;
        this.kb = new CNF();
    }

    PlayerAssumption.prototype = {
        removePossibleCard: function (card, emit) {
            //elimina la card
            this.possibleHandCards &= ~card;
            ////

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
            this.certainHandCards |= card;
            this.possibleHandCards &= ~card;
            this.notifyObservers(card);
            if (this.player.hand & this.certainHandCards) {
                this.possibleHandCards = 0;
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

        notifyObservers: function (card, emit) {
            if (!emit) {
                this.onCertainAdded.emit(card);
            }
        },
        addAnsweredSuggestion: function (suggestion) {
            var clause = new Clause();
            var cards = suggestion.suspect | suggestion.room | suggestion.weapon;

            cards = utils.contains(cards, this.certainHandCards);
            cards = utils.contains(cards, this.possibleHandCards);
            if (cards) {
               // var binary = utils.numToBinaryArray(cards);
                utils.binaryForEach(cards, function (value) {
                    clause.addLiteral(value, true);
                });
                //binary.forEach(function (value, index) {
                //    if (value != 0) {
                //        value = 1 << (binary.length - 1 - index);
                //        clause.addLiteral(value, true);
                //    }
                //});

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