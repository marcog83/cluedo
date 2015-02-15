/**
 * Created by marco on 07/02/2015.
 */
define(function (require) {
    var Board = require("../game/Board");
    var MovementController = {
        create: function (config) {
            return {
                _location: config.location,
                path: [],
                room: null,
                inRoom: false,
                gotoRoom: function (room) {
                    this.inRoom = true;
                    this.room = room;
                    return new Promise(function (resolve, reject) {
                        this.path = Board.findPath(this._location, room).map(function (position) {
                            return {
                                x: position[0],
                                y: position[1]
                            }
                        });
                        resolve(room);
                    }.bind(this));

                },
                get location() {
                    if (this.path.length) {
                        this._location = this.path.shift();

                    }
                    return this._location
                },
                exitRoom: function (toExit) {
                    //this.room.removeOccupant(this);
                    this.inRoom = false;
                    this.location = toExit;
                    this.room = null;
                }
            }
        }
    };
    return MovementController;
});