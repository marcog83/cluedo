define(function (require, exports, module) {
    'use strict';
    var Cluedo = require("../game/Cluedo");
    var Player = require("../game/Player");
    var HumanController = require("../game/HumanController");
    var AIPlayer = require("../ai/AIPlayer");
    var Suggestion = require("../game/Suggestion");
    var ToSquare = require("../game/ToSquare");
    var ToRoom = require("../game/ToRoom");
    var Accusation = require("../game/Accusation");
    var Room = require("../card/Room");
    var Suspect = require("../card/Suspect");
    var Point = require("../utils/Point");
    var Signal = require("signals");
    var MAX_TURN = 20 * 3;
    var current = 0;

    function Game() {
        this.onTurnCompleted = new Signal();
        this.onPlayerEntered = new Signal();
        this.onWin = new Signal();
        this.onFailed = new Signal();
        this.onLeave = new Signal();
        this.onRoll = new Signal();
        this.onPlayerMoved = new Signal();
        this.cluedo = new Cluedo();

        Cluedo.players.push(new Player(Suspect.PLUM, new AIPlayer()));
        Cluedo.players.push(new Player(Suspect.SCARLETT, new AIPlayer()));
        Cluedo.players.push(new Player(Suspect.WHITE, new AIPlayer()));
        Cluedo.players.push(new Player(Suspect.GREEN, new AIPlayer()));
        Cluedo.players.push(new Player(Suspect.PEACOCK, new AIPlayer()));
        Cluedo.players.push(new Player(Suspect.MUSTARD, new AIPlayer()));


        MAX_TURN = 20 * Cluedo.players.length;
    }

    Game.prototype = {
        get currentCharacter() {
            return this.curTurn.character;
        },
        start: function () {
            this.cluedo.prepareCards();
            this.takeTurn(Cluedo.players[0]);
        },
        movePlayer: function (location) {
            if (this.roll < 1) {
                return;
            }
            //
            if (Cluedo.board.squareAt(location) == null) {
                return;
            }
            if (Cluedo.board.squareAt(location).isRoom()) {
                return;
            }
            if (Cluedo.board.squareAt(location).occupant != null) {
                return;
            }
            //
            ToSquare(this.curTurn, location);
            //
            if (this.roll == 1) {
                return this.endTurn();
            }
            this.roll--;

            this.onPlayerMoved.emit(location, this.roll);
            this.selection = location;
        },
        enter: function (room) {
            ToRoom(this.curTurn, room);
            if (room != Room.POOL) {
                this.curTurn.suggest().then(function (suggestion) {
                    suggestion.callInSuspect();
                    suggestion.questionPlayers();
                    this.endTurn();
                }.bind(this));
            }
            else {
                var accusation = new Accusation(this.curTurn);
                console.log(this.curTurn.toString(), "=> Follow Me here at the pool!");
                this.curTurn.setAccusation()
                    .then(accusation.checkAccusation.bind(accusation))
                    .then(function (correct) {
                        if (correct) {
                            this.onWin.emit(this.curTurn);
                            //alert(this.curTurn.toString() + " wins! You're right!");
                            Cluedo.finished = true;
                        } else {
                            this.curTurn.eliminate();
                            this.onFailed.emit(this.curTurn);
                            this.checkRemainingPlayers();
                        }
                        this.endTurn();
                    }.bind(this));

            }
            this.onPlayerEntered.emit();
            return true;
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
            this.curTurn = player;
            if (player.character.inRoom) {
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
                        if (desiredRoom) {
                            this.enter(desiredRoom);
                        }
                    }.bind(this));
            } else {
                this._roll();
            }
        },
        leave: function () {
            var room = this.curTurn.character.room;
            //
            // this.curTurn.character.exitRoom(room.exits[0]);
            this.roll--; //uses one step.
            this.onLeave.emit(this.selection, this.roll);
        },

        _roll: function () {
            this.roll = this.cluedo.dice.roll();
            var point = this.curTurn.character.location;
            if (point == null) {
                console.log("error??");
                return;
            }
            this.onRoll.emit(point, this.roll);
        },
        endTurn: function () {

            this.roll = 0;
            this.onTurnCompleted.emit(this.curTurn);

            this.nextPlayer();
        },
        nextPlayer: function () {
            if (Cluedo.finished || current > MAX_TURN) {
                return;
            }
            current++;
            var index = Cluedo.players.indexOf(this.curTurn);
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
    module.exports = Game;
});