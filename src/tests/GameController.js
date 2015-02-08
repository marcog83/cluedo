/**
 * Created by marco.gobbi on 03/02/2015.
 */
define(function (require) {
    "use strict";
    var Cards = require("../bitwise/Cards");
    var utils = require("../utils/utils");
    var Cluedo = require("../game/Cluedo");

    function GameController(game) {
        var rooms = Cluedo.rooms;
        $("#entra-stanza").focus().click(function (e) {
            e.preventDefault();
            var room = utils.getCard(rooms);
            rooms &= ~room;
            game.enter(room);
            $("#entra-stanza").focus()
        });
    }

    return GameController;
});