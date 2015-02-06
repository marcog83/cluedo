/**
 * Created by marco.gobbi on 03/02/2015.
 */
// Help Node out by setting up define.
if (typeof exports === 'object' && typeof define !== 'function') {
    var define = function (factory) {
        factory(require, exports, module);
    };
}
define(function (require, exports, module) {
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

    module.exports = GameController;
});