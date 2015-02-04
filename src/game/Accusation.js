define(function (require, exports, module) {
    'use strict';
    var Cluedo = require("./Cluedo");

    function Accusation(player) {
        this.player = player;

    }

    Accusation.prototype = {


        checkAccusation: function (accusation) {
            var correct = accusation.filter(function (card) {
                    return _.contains(Cluedo.solution, card);
                }).length == 3;
            console.log("Let me see!!! It's", correct);
            return correct;
        }
    };
    module.exports = Accusation;
});