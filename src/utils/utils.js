define(function (require, exports, module) {
    'use strict';
    var NUM_CARDS = 32;
    var prefix = function () {
        var prefix = "";
        for (var i = 1; i < NUM_CARDS; i++) {
            prefix += "0";
        }
        return prefix.split('');
    }();

    module.exports = window.utils = {
        NUM_CARDS: 24,
        numToBinaryArray: function (num) {
            var bin = (num >>> 0).toString(2);
            if (bin.length < NUM_CARDS) {
                bin = prefix.slice(0, NUM_CARDS - bin.length).join('') + bin;
            }
            bin = bin.substring(8);
            return bin.split('').map(Number);
        },
        contains: function (source, num) {
            var partial = ~~(source & ~num);
            return source & ~partial;
        },

        binaryForEach: function (binary, callback) {
            binary = _.isNumber(binary) ? this.numToBinaryArray(binary) : binary;
            binary.forEach(function (value, index) {
                if (value === 1) {
                    value = 1 << (binary.length - 1 - index);
                    callback(value, index, binary);
                }
            });

        },
        remove: function (source, num) {
            return source & ~(1 << num);
        },
        getCard: function (cards) {
            var binary = this.numToBinaryArray(cards);

            var index = binary.indexOf(1);
            var value = 1 << (binary.length - 1 - index);
            if (!value)throw new Error("PERCHE'!!!!");
            return value;
        }
    };
})
;