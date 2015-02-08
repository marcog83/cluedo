/**
 * Created by marco on 07/02/2015.
 */
define(function () {
    var MovementController = {
        create: function () {
            return {
                location: null,
                room: null,
                inRoom: null,
                enterRoom: function (room) {
                    // room.addOccupant(this);
                    this.inRoom = true;
                    this.room = room;
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