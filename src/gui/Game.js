define(function (require, exports, module) {
    'use strict';
    var Cluedo = require("../game/Cluedo");
    var Player = require("../game/Player");
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

        Cluedo.players.push(new Player(Suspect.PLUM));
        Cluedo.players.push(new Player(Suspect.SCARLETT));
        Cluedo.players.push(new Player(Suspect.WHITE));
        Cluedo.players.push(new Player(Suspect.GREEN));
        Cluedo.players.push(new Player(Suspect.PEACOCK));
        Cluedo.players.push(new Player(Suspect.MUSTARD));
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
	            this.selection=p;
            }.bind(this))
        },
        enter: function (room) {
            if (this.rooms.indexOf(room) != -1) {
                new ToRoom(this.curTurn, room);
                if (room != Room.POOL) {

                    this.suggest();

                }
                else {
                    new Accusation(this.curTurn);
                    this.endTurn();
                }
                Drawer.draw();
                return true;
            } else return false;
        },
        takeTurn: function (player) {
            this.curTurn = player;
            if (player.character.inRoom) {
                // confirm dialog

                this._stayOrLeave()
                    .then(this.suggest.bind(this))
                    .catch(function(){
		                this._roll();
		                this.leave();
	                }.bind(this));

            } else {
                this._roll();
            }
        },
	    leave: function() {
			var room = this.curTurn.character.room;
			//

		    this.curTurn.character.exitRoom(room.exits[0]);

		    this.roll--; //uses one step.
		    this.squares = Cluedo.board.nearbySquares(this.selection, null, this.roll);
		    this.rooms = Cluedo.board.nearbyRooms(this.selection, this.roll);
		    Drawer.draw(this.squares, this.rooms);
	},
        _stayOrLeave: function () {
            return new Promise(function (resolve,reject) {

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
        },
        suggest: function () {
            var suggestion = new Suggestion(this.curTurn, this);
            return this.setSuspect()
                .then(this.setWeapon)
                .then(function (response) {
                    var s = response[0];
                    var w = response[1];
                    suggestion.suspectListener(s);
                    suggestion.weaponListener(w);
                    suggestion.callInSuspect();
                    suggestion.questionPlayers();
                    this.endTurn();
                }.bind(this));

        },
        setSuspect: function () {

            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    alertify.set({
                        labels: {
                            ok: "Ok",
                            cancel: "cancel"
                        }
                    });
                    alertify.prompt("il sospettato è...\n" + Cluedo.suspects.map(function (s) {
                        return s.name;
                    }), function (e, str) {
                        // str is the input text
                        if (e) {
                            resolve(str);
                        } else {
                            // user clicked "cancel"
                        }
                    });
                }, 1000);
            })
        },
        setWeapon: function (suspect) {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    alertify.prompt("l' arma è...\n" + Cluedo.weapons.map(function (w) {
                        return w.name;
                    }), function (e, weapon) {
                        // str is the input text
                        if (e) {
                            resolve([suspect, weapon]);

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