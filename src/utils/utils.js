// Help Node out by setting up define.
if (typeof exports === 'object' && typeof define !== 'function') {
    var define = function (factory) {
        factory(require, exports, module);
    };
}
define(function (require, exports, module) {
    'use strict';
    var bw = require("../bitwise/bw");

    var _ = require("lodash");

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    module.exports = {
        NUM_CARDS: 24,
        getCard: function (cards) {
            var binary = _.compose(bw.binaryValues, bw.numToBinaryArray)(cards);
            var index = getRandomInt(0, binary.length - 1);


            return binary[index];
        }
    };
});
