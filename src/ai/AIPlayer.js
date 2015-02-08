/**
 * Created by marco.gobbi on 02/02/2015.
 */
define(function (require) {
    "use strict";
    var _ = require("lodash");
    var SearchSpace = require("./SearchSpace");

    var Clause = require("./Clause");
    var PlayerAssumption = require("./PlayerAssumption");
    //
    var Cluedo = require("../game/Cluedo");
    var Suggestion = require("../game/Suggestion");
    var Cards = require("../bitwise/Cards");
    var bw = require("../bitwise/bw");
    var AIPlayer = {
        create: function () {
            return {
                shownCards: {},
                assumptions: {},
                hand: 0,
                searchSpace: new SearchSpace(Cluedo.suspects, Cluedo.weapons, Cluedo.rooms),
                setHand: function () {
                    this.assumptions = [];
                    var otherPlayers = Cluedo.players.filter(function (player) {
                        return player != this.player
                    }.bind(this));
                    //

                    otherPlayers.forEach(function (player) {
                        var a = new PlayerAssumption(player, Cluedo.cards);

                        this.assumptions.push(a);
                        var tmpHM = {};
                        bw.binaryForEach(this.hand, function (value) {
                            tmpHM[value] = false;
                        });
                        this.shownCards[player] = tmpHM;
                    }.bind(this));
                    //
                    bw.binaryForEach(this.hand, function (card) {
                        this.searchSpace.update(card);
                        this.assumptions.forEach(function (assumption) {
                            assumption.update(card);
                        }.bind(this));
                    }.bind(this));
                    this.assumptions.forEach(function (assumption) {
                        assumption.onCertainAdded.connect(this.observeAssumption.bind(this));
                    }.bind(this));
                    this.searchSpace.onChanged.connect(function (card) {
                        this.assumptions.forEach(function (assumption) {
                            assumption.update(card);
                        });
                    }.bind(this));
                    /**/
                },
                observeAssumption: function (card, _, cAssumption) {
                    if (this.player.hasAccusation)return;
                    this.searchSpace.update(card);
                    this.assumptions.forEach(function (assumption) {
                        if (assumption != cAssumption) {
                            assumption.update(card);
                        }
                    });
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
                seeCard: function (suggestion, card, answerer, _couldNotAnswer) {
                    this.couldNotAnswer(suggestion, _couldNotAnswer);
                    var pa = this.getPlayerAssumption(answerer);
                    pa.addCertainHandCard(card);
                },
                couldNotAnswer: function (suggestion, couldNotAnswer) {
                    couldNotAnswer
                        .filter(function (player) {
                            return player != this.player
                        }.bind(this))
                        .forEach(function (player) {
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
                    var suggestion = {
                        suspect: this.searchSpace.suspect,
                        weapon: this.searchSpace.weapon,
                        room: this.searchSpace.room,
                        player: player
                    };
                    var ranks = this.getRanks();
                    var bestRanks = {
                        weapon: 10000,
                        suspect: 10000,
                        room: 10000
                    };
                    console.log("what about...", [
                        suggestion.suspect,
                        suggestion.weapon,
                        suggestion.room
                    ]);
                    _.forIn(ranks, function (item, key) {

                        if (item.rank < bestRanks[item.type]) {
                            console.log("think... this", item.type, "is better ->", key);
                            suggestion[item.type] = parseInt(key);
                            this.searchSpace[item.type] = parseInt(key);
                            bestRanks[item.type] = item.rank;
                        }
                    }.bind(this));


                    console.log(player.toString(), "=>", [
                        suggestion.suspect,
                        suggestion.weapon,
                        suggestion.room
                    ]);
                    return Promise.resolve(suggestion);
                },
                getRanks: function () {
                    function _map(num, type) {
                        return bw.filter(num).reduce(function (result, item) {
                            result[item.value] = {
                                rank: 1,
                                type: type
                            };
                            return result;
                        }, {});
                    }

                    var weapons = _map(this.searchSpace.weapons, 'weapon');
                    var suspects = _map(this.searchSpace.suspects, 'suspect');
                    var rooms = _map(this.searchSpace.rooms, 'room');

                    var ranks = _.assign(weapons, suspects);
                    ranks = _.assign(ranks, rooms);
                    // weapons.concat(suspects, rooms);

                    var inc = this.assumptions.length + 1;

                    this.assumptions.forEach(function (assumption) {

                        var nClauses = assumption.kb.clauses.length;
                        var literals = assumption.kb.getAllLiterals();


                        _.forIn(literals, function (entry, card) {
                            ranks[card] && (ranks[card].rank += (inc * entry / nClauses));
                        });


                        bw.binaryForEach(assumption.possibleHandCards, function (card, index) {
                            ranks[card].rank += inc;
                        });
                        inc--;
                    }.bind(this));


                    return ranks;

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
                    if (answerer == null || this.player == answerer) { // Not interesting
                        return;
                    }
                    var pa = this.getPlayerAssumption(answerer);
                    pa.addAnsweredSuggestion(suggestion);
                },
                stayOrLeave: function (player) {
                    //TODO come automatizzare scelta!!!
                    var desiredRoom = this.searchSpace.room;
                    if (player.hasAccusation) {
                        console.log(player.toString(), "=> I Know who is the Murderer!");
                        desiredRoom = Cards.POOL;
                    }
                    if (player.room == desiredRoom) {
                        return Promise.resolve(true);
                    } else {
                        return Promise.reject(desiredRoom);
                    }
                },
                setAccusation: function () {
                    var accusation = this.searchSpace.getAccusation();
                    console.log(this.player.toString(), "=> I accuse:", accusation);
                    return Promise.resolve(accusation);
                }
            };
        }
    };

    return AIPlayer;
});