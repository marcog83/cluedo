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
        this.hand = [];
        this.searchSpace = new SearchSpace();

    }

    AIPlayer.prototype = {
        getSearchSpace: function () {
            return this.searchSpace;
        },
        setHand: function (hand) {
            this.hand = hand;
            this.assumptions = [];
            var players = Cluedo.players;
            var numPlayer = players.length,
                thisPlayerPassed = false;
            var shownCards = {};
            for (var i = 0, j = 1; j < numPlayer; i = (i + 1) % numPlayer) {
                if (thisPlayerPassed) {
                    this.assumptions.push(new PlayerAssumption(players[i]));
                    var tmpHM = {};
                    this.hand.forEach(function (c) {
                        tmpHM[c] = false;
                    });
                    shownCards[players[i]] = tmpHM;
                    j++;
                } else if (this == players[i].controller) {
                    thisPlayerPassed = true;
                }
            }
            this.hand.forEach(function (c) {
                this.searchSpace.excludeCard(c);
            }.bind(this));
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
            //for (Card card : hand) {
            //	o.notifyObservers(card);
            //}
        },
        ask: function (questionair, suggestion) {
            this.shownCards[questionair]=this.shownCards[questionair] ||{};
            var notShownCard = null;
            if (this.hand.indexOf(suggestion.suspect) != -1) {
                if (this.shownCards[questionair][suggestion.suspect]) {
                    return suggestion.suspect;
                }
                this.shownCards[questionair][suggestion.suspect]=true;
                notShownCard = suggestion.suspect;
            }
            if (this.hand.indexOf(suggestion.weapon) != -1) {
                if (this.shownCards[questionair][suggestion.weapon]) {
                    return suggestion.weapon
                }
                this.shownCards[questionair][suggestion.weapon]=true;
                notShownCard = suggestion.weapon;
            }
            if (this.hand.indexOf(suggestion.room) != -1) {
                if (this.shownCards[questionair][suggestion.room]) {
                    return suggestion.room;
                }
                this.shownCards[questionair][suggestion.room]=true;
                notShownCard = suggestion.room;
            }
            return notShownCard;
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
        suggest: function (player) {
            var cards = this.searchSpace.getPossibleCards();
            var suggestion = new Suggestion(player);
            suggestion.suspectListener(this.searchSpace.getSolutionPerson().name);
            suggestion.weaponListener(this.searchSpace.getSolutionWeapon().name);
            //int bestRanks[] = {-1, -1, -1}; // Dependent on Kind.size!
            var ranks =  cards.reduce(function (result, card) {
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
            return Promise.resolve(suggestion);
        },
        observeMove: function (suggestion, questionair, answerer, couldNotAnswer) {
            this.couldNotAnswer(suggestion, couldNotAnswer);
            var pa = this.getPlayerAssumption(answerer);
            var addClause = true;
            var person = suggestion.suspect;
            var room = suggestion.room;
            var weapon = suggestion.weapon;
            for (var i = 0; i < pa.certainhand.length; i++) {
                var c = pa.certainhand[i];
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
        },
        stayOrLeave: function () {
            //TODO come automatizzare scelta!!!
            return new Promise(function (resolve, reject) {

                setTimeout(function () {
                    alertify.set({
                        labels: {
                            ok: "Stay",
                            cancel: "Leave"
                        }
                    });
                    alertify.confirm("Cosa vuoi fare?", function (e) {
                        if (e) {
                            // user clicked "Stay"

                            resolve();

                        } else {
                            reject();
                            // user clicked "Leave"
                        }
                    });
                }, 500);
            });
        }
    };
    return AIPlayer;
});