define(function (require, exports, module) {
    'use strict';
    function Dice() {
    }

    Dice.prototype = {
        roll: function () {
            var d1 = 1 + parseInt(Math.random() * 6);
            var d2 = 1 + parseInt(Math.random() * 6);
            return d1 + d2;
        }
    };
    module.exports = Dice;
});