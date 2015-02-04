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
            for (var i = 0, j = 1; j < numPlayer; i = (i + 1) % numPlayer) {
                if (thisPlayerPassed) {
                    this.assumptions.push(new PlayerAssumption(players[i]));
                    var tmpHM = {};
                    this.hand.forEach(function (c) {
                        tmpHM[c] = false;
                    });
                    this.shownCards[players[i]] = tmpHM;
                    j++;
                } else if (this == players[i].controller) {
                    thisPlayerPassed = true;
                }
            }
            this.hand.forEach(function (card) {
                this.searchSpace.update(card);
                this.assumptions.forEach(function (assumption) {
                    assumption.update(card);
                    // Object.observe(assumption.certainHandCards, this.observeAssumption.bind(this));
                }.bind(this));
            }.bind(this));
            this.assumptions.forEach(function (assumption) {
                assumption.onCertainAdded.connect(this.observeAssumption.bind(this));
                // Object.observe(assumption.certainHandCards, this.observeAssumption.bind(this));
            }.bind(this));
            this.searchSpace.onChanged.connect(function(card){
                this.assumptions.forEach(function (assumption) {
                    assumption.update(card);
                });
            }.bind(this))
        },
        observeHand: function (changes) {
            console.log("observeHand", changes);
        },
        observeSearchSpace: function (changes) {
            console.log("searchSpace", changes);
        },
        observeAssumption: function (card) {
            this.searchSpace.update(card);
            this.assumptions.forEach(function (assumption) {
                assumption.update(card);
            });
        },
        ask: function (questionair, suggestion) {
            this.shownCards[questionair] = this.shownCards[questionair] || {};
            var notShownCard = null;
            if (this.hand.indexOf(suggestion.suspect) != -1) {
                if (this.shownCards[questionair][suggestion.suspect]) {
                    return suggestion.suspect;
                }
                this.shownCards[questionair][suggestion.suspect] = true;
                notShownCard = suggestion.suspect;
            }
            if (this.hand.indexOf(suggestion.weapon) != -1) {
                if (this.shownCards[questionair][suggestion.weapon]) {
                    return suggestion.weapon
                }
                this.shownCards[questionair][suggestion.weapon] = true;
                notShownCard = suggestion.weapon;
            }
            if (this.hand.indexOf(suggestion.room) != -1) {
                if (this.shownCards[questionair][suggestion.room]) {
                    return suggestion.room;
                }
                this.shownCards[questionair][suggestion.room] = true;
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

            console.log(player.toString(), " vai in", this.searchSpace.getSolutionRoom().name, "!");
            //int bestRanks[] = {-1, -1, -1}; // Dependent on Kind.size!
            var ranks = cards.reduce(function (result, card) {
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
            console.log(player.toString(), "=>", [
                suggestion.suspect.name,
                suggestion.weapon.name,
                suggestion.room.name
            ]);
            return Promise.resolve(suggestion);
            /*return new Promise(function(resolve){
                setTimeout(function(){
                    resolve(suggestion)
                },250);
            });*/
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
            //
            //var addClause = true;
            //var person = suggestion.suspect;
            //var room = suggestion.room;
            //var weapon = suggestion.weapon;
            //
            //for (var i = 0; i < pa.certainHandCards.length; i++) {
            //    var c = pa.certainHandCards[i];
            //    if (c == person || c == room || c == weapon) {
            //        addClause = false;
            //    }
            //}
            //if (addClause) {
            //    var clause = new Clause();
            //    clause.addLiteral(person, true);
            //    clause.addLiteral(room, true);
            //    clause.addLiteral(weapon, true);
            //    pa.kb.addClause(clause);
            //}
        },
        stayOrLeave: function (player) {
            //TODO come automatizzare scelta!!!
            var desiredRoom = this.searchSpace.getSolutionRoom();

            if (player.hasAccusation) {
                console.log(player.toString(),"=> I Know who is the Murderer!");
                desiredRoom = Room.POOL;
            }
            if (player.character.room == desiredRoom) {
                return Promise.resolve(true);
            } else {
                return Promise.reject(desiredRoom);
            }
        },
        setAccusation: function () {
            var accusation=this.searchSpace.getAccusation();
            console.log(this.cPlayer.toString(),"=> I accuse:",accusation.map(function(card){return card.name;}));
            return Promise.resolve(accusation);
        }
    };
    return AIPlayer;
});