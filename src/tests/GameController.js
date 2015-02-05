/**
 * Created by marco.gobbi on 03/02/2015.
 */
define(function (require) {
    "use strict";
    var Cards = require("../bitwise/Cards");

    function GameController(game) {
        $("#entra-stanza").click(function (e) {
            e.preventDefault();
            game.enter(Cards.HALL);
        });
    }

    return GameController;
});