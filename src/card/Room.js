define(function (require, exports, module) {
    'use strict';
    var Point = require("../utils/Point");

    function Room(name, start) {
        this.name = name;
        this.start = start;
        this.occupants = [];
        this.exits = [];
    }



    Room.prototype = {
        toString: function () {
            return this.name;
        },
        addOccupant: function (character) {
            this.occupants.push(character);
        },

        getOccupants: function () {
            return this.occupants;
        },

        removeOccupant: function (character) {
            var index = this.occupants.indexOf(character);
            if (index > -1) {
                this.occupants.splice(index, 1);
            }

        },

        addExit: function (p) {
            this.exits.push(p);
        },


        getStart: function () {
            return this.start;
        }
    };

    Room.SPA = new Room("Spa", new Point(0, 0));
    Room.THEATRE = new Room("Theatre", new Point(10, 0));
    Room.LIVING = new Room("Living", new Point(16, 0));
    Room.OBSERVATORY = new Room("Observatory", new Point(22, 0));
    Room.PATIO = new Room("Patio", new Point(3, 11));
    Room.POOL = new Room("Pool", new Point(13, 13));
    Room.HALL = new Room("Hall", new Point(20, 11));
    Room.KITCHEN = new Room("Kitchen", new Point(3, 22));
    Room.DINING = new Room("Dining", new Point(12, 22));
    Room.GUEST = new Room("Guest", new Point(20, 22));
    module.exports = Room;
});