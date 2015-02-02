define(function (require, exports, module) {
    'use strict';
    var Point = require("../utils/Point");
    var Suspect = require("../card/Suspect");
    var Room = require("../card/Room");
    var Entrance = require("./Entrance");

    function Square(c, x, y) {
        this.c = c;
        this.coord = new Point(x, y);
        this.room = this.roomFromChar(c);
        if (c == 'R') this.setOccupant(Suspect.SCARLETT);
        else if (c == 'G') this.setOccupant(Suspect.GREEN);
        else if (c == 'P') this.setOccupant(Suspect.PLUM);
        else if (c == 'B') this.setOccupant(Suspect.PEACOCK);
        else if (c == 'Y') this.setOccupant(Suspect.MUSTARD);
        else if (c == 'W') this.setOccupant(Suspect.WHITE);
    }

    Square.prototype = {
        setEntranceTo: function (c) {
            if (c == '^' || c == '<' || c == '>' || c == 'v') {
                this.c = c;
                return;
            }
            this.entrance = new Entrance(this.roomFromChar(c));
            this.roomFromChar(c).addExit(this.coord);
        },


        getCoord: function () {
            return this.coord;
        },

        roomFromChar: function (c) {
            var room;
            if (c == 's') room = Room.SPA;
            else if (c == 't') room = Room.THEATRE;
            else if (c == 'l') room = Room.LIVING;
            else if (c == 'o') room = Room.OBSERVATORY;
            else if (c == 'p') room = Room.PATIO;
            else if (c == 'e') room = Room.POOL;
            else if (c == 'h') room = Room.HALL;
            else if (c == 'k') room = Room.KITCHEN;
            else if (c == 'd') room = Room.DINING;
            else if (c == 'g') room = Room.GUEST;
            else room = null;
            return room;
        },

        isRoom: function () {
            return this.room != null;
        },


        toString: function () {
            if (this.entrance == null) return this.c;
            else return "O";
        },


        setOccupant: function (occupant) {
            this.occupant = occupant;
            if (this.room == null) this.c = '.';
        },

        getMoveFrom: function () {
            return this.moveFrom;
        },

        setMoveFrom: function (moveFrom) {
            this.moveFrom = moveFrom;
        }
    };
    module.exports = Square;
});