/**
 * Created by marco on 07/02/2015.
 */

class MovementController {
    constructor() {
        this.room = undefined;
        this.inRoom = false;

    }

    gotoRoom(room) {
        this.inRoom = true;
        this.room = room;
        return Promise.resolve(room);

    }

    exitRoom(toExit) {
        //this.room.removeOccupant(this);
        this.inRoom = false;
        this.location = toExit;
        this.room = null;
    }
}

module.exports = MovementController;
