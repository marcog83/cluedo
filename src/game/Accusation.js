define(function (require, exports, module) {
    'use strict';
    var Cluedo = require("./Cluedo");

    function Accusation(player) {
        this.player = player;

    }

    Accusation.prototype = {


        checkAccusation: function (accusation) {
            var correct = Cluedo.solution == accusation;
            console.log("Let me see!!! It's", correct);
            return correct;
        }
    };
    module.exports = Accusation;
});