define(function (require, exports, module) {
    'use strict';
    var Cluedo = require("./Cluedo");

    function ToRoom(player, room) {
        Cluedo.board.squareAt(player.character.location).setOccupant(null);
        player.character.enterRoom(room);
        player.character.setLocation(null);
    }

    module.exports = ToRoom;
});