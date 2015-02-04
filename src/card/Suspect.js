define(function (require, exports, module) {
    'use strict';
    var Color = require("../utils/Color");

    function Suspect(name, color) {
        this.name = name;
        this.color = color;
        this.location = null;
        this.inRoom = null;
        this.type = 'Suspect';
    };

    //
    Suspect.prototype = {
        toString: function () {
            return this.name;
        },

        equals: function (s) {
            return this.name == s.toString();
        },


        setLocation: function (loc) {
            this.location = loc;
        },


        enterRoom: function (room) {
           // room.addOccupant(this);
            this.inRoom = true;
            this.room = room;
        },

        exitRoom: function (toExit) {
            this.room.removeOccupant(this);
            this.inRoom = false;
            this.location = toExit;
            this.room = null;
        }


    };
    Suspect.PLUM = new Suspect("Plum", Color.MAGENTA);
    Suspect.SCARLETT = new Suspect("Scarlett", Color.RED);
    Suspect.WHITE = new Suspect("White", Color.WHITE);
    Suspect.GREEN = new Suspect("Green", Color.GREEN);
    Suspect.PEACOCK = new Suspect("Peacock", Color.BLUE);
    Suspect.MUSTARD = new Suspect("Mustard", Color.YELLOW);
    module.exports = Suspect;
});