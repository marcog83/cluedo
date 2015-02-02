define(function (require, exports, module) {
    'use strict';
    var Cluedo = require("./Cluedo");

    function ToSquare(player, point) {
        this.player = player;
        this.point = point;
        if (player.character.location != null)
            Cluedo.board.squareAt(player.character.location).setOccupant(null);
        player.character.setLocation(point);
        Cluedo.board.squareAt(point).setOccupant(player.character);
    }

    module.exports = ToSquare;
});