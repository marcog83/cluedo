define(function (require, exports, module) {
    'use strict';
    var Cluedo = require("./Cluedo");
    var Dice = require("./Dice");
    var Player = require("./Player");

    var AIPlayer = require("../ai/AIPlayer");

    var Cards = require("../bitwise/Cards");
    var Point = require("../utils/Point");
    var Signal = require("signals");
    //
    var MAX_TURN = 20 * 3;
    var current = 0;

    function GamePlay() {
        this.onTurnCompleted = new Signal();
        this.onPlayerEntered = new Signal();
        this.onWin = new Signal();
        this.onFailed = new Signal();
        this.onLeave = new Signal();
        this.onRoll = new Signal();

        this.cluedo = new Cluedo();

        Cluedo.players.push(new Player(Cards.PLUM, new AIPlayer()));
        Cluedo.players.push(new Player(Cards.SCARLETT, new AIPlayer()));
        Cluedo.players.push(new Player(Cards.WHITE, new AIPlayer()));
        Cluedo.players.push(new Player(Cards.GREEN, new AIPlayer()));
        Cluedo.players.push(new Player(Cards.PEACOCK, new AIPlayer()));
        Cluedo.players.push(new Player(Cards.MUSTARD, new AIPlayer()));


        MAX_TURN = 20 * Cluedo.players.length;
    }

    GamePlay.prototype = {

        start: function () {
            this.cluedo.prepareCards();
            this.takeTurn(Cluedo.players[0]);
        },

        enter: function (room) {
            this.currentPlayer.enterRoom(room);
            if (room != Cards.POOL) {
                this.currentPlayer.suggest().then(function (suggestion) {
                    suggestion.callInSuspect();
                    suggestion.questionPlayers();
                    this.endTurn();
                }.bind(this));
            }
            else {
                var accusation = new Accusation(this.currentPlayer);
                console.log(this.currentPlayer.toString(), "=> Follow Me here at the pool!");
                this.currentPlayer.setAccusation()
                    .then(this.checkAccusation.bind(this))
                    .then(this.endTurn.bind(this));

            }
            this.onPlayerEntered.emit();
            return true;
        },
        checkAccusation: function (accusation) {
            var correct = Cluedo.solution == accusation;
            console.log("Let me see!!! It's", correct);
            if (correct) {
                this.onWin.emit(this.currentPlayer);
                //alert(this.currentPlayer.toString() + " wins! You're right!");
                Cluedo.finished = true;
            } else {
                this.currentPlayer.eliminate();
                this.onFailed.emit(this.currentPlayer);
                this.checkRemainingPlayers();
            }
            return correct;
        },
        checkRemainingPlayers: function () {
            var remaining = Cluedo.players.filter(function (player) {
                return player.inGame
            });
            if (remaining.length == 1) {
                this.onWin.emit(remaining[0]);
                Cluedo.finished = true;
            }
        },
        takeTurn: function (player) {
            console.log(parseInt(current / Cluedo.players.length), "-------------------- " + player.toString() + " --------------------------------");
            this.currentPlayer = player;
            if (player.inRoom) {
                // confirm dialog
                player.stayOrLeave()
                    .then(player.suggest.bind(player))
                    .then(function (suggestion) {
                        suggestion.callInSuspect();
                        suggestion.questionPlayers();
                        this.endTurn();
                    }.bind(this))
                    .catch(function (desiredRoom) {

                        this._roll();
                        this.leave();
                        if (_.isNumber(desiredRoom)) {
                            this.enter(desiredRoom);
                        }
                    }.bind(this));
            } else {
                this._roll();
            }
        },
        leave: function () {
            //var room = this.currentPlayer.character.room;
            //
            // this.currentPlayer.character.exitRoom(room.exits[0]);
            this.roll--; //uses one step.
            this.onLeave.emit(this.selection, this.roll);
        },

        _roll: function () {
            this.roll = Dice.roll();

            this.onRoll.emit(this.roll);
        },
        endTurn: function () {

            this.roll = 0;
            this.onTurnCompleted.emit(this.currentPlayer);

            this.nextPlayer();
        },
        nextPlayer: function () {
            if (Cluedo.finished || current > MAX_TURN) {
                return;
            }
            current++;
            var index = Cluedo.players.indexOf(this.currentPlayer);
            var inGamePlayers = Cluedo.players.filter(function (player) {
                return player.inGame;
            });
            index = inGamePlayers.length < Cluedo.players.length ? index : index + 1;
            if (index >= inGamePlayers.length) {
                index = 0;
            }

            this.takeTurn(inGamePlayers[index]);
        }
    };
    module.exports = GamePlay;
});