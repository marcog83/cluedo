define(function (require, exports, module) {
    'use strict';
    var Cluedo = require("./Cluedo");

    function Accusation(player) {
        this.player = player;

    }

    Accusation.prototype = {


        checkAccusation: function (accusation) {

            if (_.intersection(Cluedo.solution.map(function (card) {
                    return card.name;
                }), accusation).length == 3) {

                return true;
            } else {

                return false;
            }
        }
    };
    module.exports = Accusation;
});