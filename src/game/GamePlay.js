define(function (require, exports, module) {
    'use strict';
    var _ = require("lodash");
    var bw = require("../bitwise/bw");
    var Cluedo = require("./Cluedo");
    var Dice = require("./Dice");
    var Player = require("./Player");
    var Suggestion = require("./Suggestion");
    var AIPlayer = require("../ai/AIPlayer");
    var Cards = require("../bitwise/Cards");
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
        //
        Cluedo.players = [];
        Cluedo.finished = false;


    }

    GamePlay.prototype = {
        start: function () {
            MAX_TURN = 20 * Cluedo.players.length;
            current = 0;
            Cluedo.prepareCards();

            this.takeTurn(Cluedo.players[0]);
        },
        enter: function (room) {
          //  this.currentPlayer.gotoRoom(room).then(function (room) {
                if (room != Cards.POOL) {
                    this.currentPlayer.suggest()
                        .then(Suggestion.questionPlayers)
                        .then(this.endTurn.bind(this));
                }
                else {
                    console.log(this.currentPlayer.toString(), "=> Follow Me here at the pool!");
                    this.currentPlayer.setAccusation()
                        .then(this.checkAccusation.bind(this))
                        .then(this.endTurn.bind(this));
                }
                this.onPlayerEntered.emit();
         //   }.bind(this));

        },
        checkAccusation: function (accusation) {
            var correct = Cluedo.solution == accusation;
            console.log("Let me see!!! It's", correct);
            if (correct) {
                this.onWin.emit(this.currentPlayer, this.currentPlayer.getFormattedAccusation(), Cluedo.solution);
                Cluedo.finished = true;
            } else {
                this.currentPlayer.eliminate();
                this.onFailed.emit(this.currentPlayer, accusation, Cluedo.solution);
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
                    .then(Suggestion.questionPlayers)
                    .then(this.endTurn.bind(this))
                    .catch(function (desiredRoom) {
                        this._roll();
                        this.leave();
                        if (_.isNumber(desiredRoom)) {
                            this.enter(desiredRoom);
                        } else {
                            throw desiredRoom;
                        }
                    }.bind(this));
            } else {
                this.enter(player.desiredRoom);
               // this._roll(player);
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
        endTurn: function (result) {
            this.roll = 0;
            if(typeof(result)!="boolean"){
                this.onTurnCompleted.emit(result);
            }

        },
        nextPlayer: function () {
            if (Cluedo.finished || current > MAX_TURN) {
                if (current > MAX_TURN) {
                    Cluedo.players.filter(function (player) {
                        return player.inGame;
                    }).forEach(function (p, i) {
                        console.log(i, bw.numToBinaryArray(p.controller.searchSpace.getAccusation()));
                    });
                    console.log("s", bw.numToBinaryArray(Cluedo.solution));
                }

                return;
            }
            current++;

            var inGamePlayers = Cluedo.players.filter(function (player) {
                return player.inGame;
            });
            var index = current % inGamePlayers.length;

            this.takeTurn(inGamePlayers[index]);
        }
    };
    module.exports = GamePlay;
});