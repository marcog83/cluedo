// Help Node out by setting up define.
if (typeof exports === 'object' && typeof define !== 'function') {
    var define = function (factory) {
        factory(require, exports, module);
    };
}
define(function (require, exports, module) {
    'use strict';
    var Cluedo = require("./Cluedo");
    var Dice = require("./Dice");
    var Player = require("./Player");
    var Suggestion = require("./Suggestion");
    var AIPlayer = require("../ai/AIPlayer");
    var Cards = require("../bitwise/Cards");
    var bw = require("../bitwise/bw");
    var Signal = require("js-signal-slot");

    var _ = require("lodash");

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
        Cluedo.finished=false;
        current = 0;
        Cluedo.players=[];
        //
        Cluedo.players.push(new Player(Cards.PLUM, AIPlayer.create()));
        Cluedo.players.push(new Player(Cards.SCARLETT, AIPlayer.create()));
        Cluedo.players.push(new Player(Cards.WHITE, AIPlayer.create()));
        Cluedo.players.push(new Player(Cards.GREEN, AIPlayer.create()));
        Cluedo.players.push(new Player(Cards.PEACOCK, AIPlayer.create()));
        Cluedo.players.push(new Player(Cards.MUSTARD, AIPlayer.create()));
        //
        MAX_TURN = 20 * Cluedo.players.length;
    }

    GamePlay.prototype = {
        start: function () {
            Cluedo.prepareCards();
            this.takeTurn(Cluedo.players[0]);
        },
        enter: function (room) {
            this.currentPlayer.enterRoom(room);
            this.onPlayerEntered.emit();
            if (room != Cards.POOL) {
                return this.currentPlayer.suggest()
                    .then(Suggestion.questionPlayers)
                    .then(this.endTurn.bind(this));
            }
            else {
                return this.currentPlayer.setAccusation()
                    .then(this.checkAccusation.bind(this))
                    .then(this.endTurn.bind(this));
            }

        },
        checkAccusation: function (accusation) {
            var correct = Cluedo.solution == accusation;
            if (correct) {
                this.onWin.emit(this.currentPlayer, accusation,Cluedo.solution, parseInt(current / Cluedo.players.length));
                Cluedo.finished = true;
            } else {
                this.currentPlayer.eliminate();
                this.onFailed.emit(this.currentPlayer, accusation, Cluedo.solution,parseInt(current / Cluedo.players.length));
                this.checkRemainingPlayers();
            }
            return correct;
        },
        checkRemainingPlayers: function () {
            var remaining = Cluedo.players.filter(function (player) {
                return player.inGame
            });
            if (remaining.length == 1) {
                this.onWin.emit(remaining[0],0, Cluedo.solution,parseInt(current / Cluedo.players.length));
                Cluedo.finished = true;
            }
        },
        takeTurn: function (player) {
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

            var inGamePlayers = Cluedo.players.filter(function (player) {
                return player.inGame;
            });
            var index = current % inGamePlayers.length;

            this.takeTurn(inGamePlayers[index]);
        }
    };
    module.exports = GamePlay;
});