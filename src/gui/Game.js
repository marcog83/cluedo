define(function (require, exports, module) {
    'use strict';
    var Cluedo = require("../game/Cluedo");
    var Player = require("../game/Player");
    var HumanController = require("../game/HumanController");
    var AIPlayer = require("../ai/IAPlayer");
    var Suggestion = require("../game/Suggestion");
    var ToSquare = require("../game/ToSquare");
    var ToRoom = require("../game/ToRoom");
    var Accusation = require("../game/Accusation");
    var Room = require("../card/Room");
    var Suspect = require("../card/Suspect");
    var Point = require("../utils/Point");
    var Drawer = require("./Drawer");
    var Key = {
        E: 69,
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39
    };


    function Game() {
        this.handlers();
        Drawer.init();
        this.cluedo = new Cluedo();

        //Cluedo.players.push(new Player(Suspect.PLUM));
        Cluedo.players.push(new Player(Suspect.PLUM, new AIPlayer()));
        Cluedo.players.push(new Player(Suspect.SCARLETT, new HumanController()));
        /*Cluedo.players.push(new Player(Suspect.WHITE));
         Cluedo.players.push(new Player(Suspect.GREEN));
         Cluedo.players.push(new Player(Suspect.PEACOCK));
         Cluedo.players.push(new Player(Suspect.MUSTARD));*/
        this.cluedo.prepareCards();
        this.takeTurn(Cluedo.players[0])
    }

    Game.prototype = {
        handlers: function () {
            document.addEventListener("keyup", function (e) {

                var p = this.curTurn.character.location;
                if (p == null) return;
                switch (e.keyCode) {
                    case Key.UP:
                        p = new Point(p.x, p.y - 1);
                        break;
                    case Key.DOWN:
                        p = new Point(p.x, p.y + 1);
                        break;
                    case Key.LEFT:
                        p = new Point(p.x - 1, p.y);
                        break;
                    case Key.RIGHT:
                        p = new Point(p.x + 1, p.y);
                        break;
                    case Key.E:
                        var sq = Cluedo.board.squareAt(this.curTurn.character.location);
                        if (!sq.entrance) return;
                        this.enter(sq.entrance.room);
                        return;

                        break;

                }
                if (this.roll < 1) return;
                //
                if (Cluedo.board.squareAt(p) == null) return;
                if (Cluedo.board.squareAt(p).isRoom()) return;
                if (Cluedo.board.squareAt(p).occupant != null) return;
                //
                new ToSquare(this.curTurn, p);
                if (this.roll == 1) return this.endTurn();
                this.roll--;

                console.log("move to", e.keyCode, "mosse left:", this.roll);
                this.squares = Cluedo.board.nearbySquares(p, null, this.roll);
                this.rooms = Cluedo.board.nearbyRooms(p, this.roll);
                Drawer.draw(this.squares, this.rooms, p);
                this.selection = p;
            }.bind(this))
        },
        enter: function (room) {
            if (this.rooms.indexOf(room) != -1) {
                new ToRoom(this.curTurn, room);
                if (room != Room.POOL) {

                    this.curTurn.suggest().then(function (suggestion) {
                        suggestion.callInSuspect();
                        suggestion.questionPlayers();
                        this.endTurn();
                    }.bind(this))

                }
                else {
                    var accusation = new Accusation(this.curTurn);
                    this.curTurn.setAccusation()
                        //.then(this.setWeapon.bind(this))
                        //.then(this.setRoom.bind(this))
                        .then(accusation.checkAccusation.bind(accusation))
                        .then(function (correct) {
                            if (correct) {
                                alert(this.curTurn.toString() + " wins! You're right!");
                                Cluedo.finished = true;
                            } else {
                                this.curTurn.eliminate();
                                this.checkRemainingPlayers();
                            }
                        }.bind(this));
                    this.endTurn();
                }
                Drawer.draw();
                return true;
            } else return false;
        },
        checkRemainingPlayers: function () {

            var remaining = Cluedo.players.filter(function (player) {

                return player.inGame
            });

            if (remaining.length == 1) {
                alert("Win by default Only " + remaining[0] + " remains!");
                Cluedo.finished = true;
            }
        },
        takeTurn: function (player) {
            this.curTurn = player;
            if (player.character.inRoom) {
                // confirm dialog
                player.stayOrLeave().then(player.suggest.bind(player))
                    .then(function (suggestion) {
                        suggestion.callInSuspect();
                        suggestion.questionPlayers();
                        this.endTurn();
                    }.bind(this))
                    .catch(function () {
                        this._roll();
                        this.leave();
                    }.bind(this));

            } else {
                this._roll();
            }
        },
        leave: function () {
            var room = this.curTurn.character.room;
            //

            this.curTurn.character.exitRoom(room.exits[0]);

            this.roll--; //uses one step.
            this.squares = Cluedo.board.nearbySquares(this.selection, null, this.roll);
            this.rooms = Cluedo.board.nearbyRooms(this.selection, this.roll);
            Drawer.draw(this.squares, this.rooms);
        },


        setRoom: function (partial) {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    alertify.prompt("la stanza è...\n" + Cluedo.rooms.map(function (r) {
                        return r.name;
                    }), function (e, room) {
                        // str is the input text
                        if (e) {
                            partial.push(room);
                            resolve(partial);

                        } else {
                            // user clicked "cancel"
                        }
                    });


                }, 1000)
            })
        },
        _roll: function () {
            this.roll = this.cluedo.dice.roll();
            var point = this.curTurn.character.location;
            if (point == null) {
                console.log("error??");
                return;
            }
            this.squares = Cluedo.board.nearbySquares(point, null, this.roll);
            this.rooms = Cluedo.board.nearbyRooms(point, this.roll);
            Drawer.draw(this.squares, this.rooms, point);
        },
        endTurn: function () {
            if (Cluedo.finished) this.end();

            this.squares = null;
            this.rooms = null;
            this.roll = 0;
            Drawer.draw([], []);
            this.nextPlayer();
        },
        end: function () {
        },
        nextPlayer: function () {
            var index;
            do {
                index = Cluedo.players.indexOf(this.curTurn) + 1;
                if (index == Cluedo.players.length) index = 0;
            } while (!Cluedo.players[index].inGame);
            this.takeTurn(Cluedo.players[index]);
        }
    };
    module.exports = Game;
});