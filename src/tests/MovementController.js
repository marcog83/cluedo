/**
 * Created by marco on 07/02/2015.
 */
define(function (require) {

    var MovementController = {
        create: function () {
            return {

                room: null,
                inRoom: false,
                gotoRoom: function (room) {
                    this.inRoom = true;
                    this.room = room;
                    return Promise.resolve(room);

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