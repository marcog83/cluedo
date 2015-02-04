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

    module.exports = {
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

        set: function (source, num) {
            return source | 1 << num;
        },
        remove: function (source, num) {
            return source & ~(1 << num);
        },
        getCard: function (cards) {
            var binary = this.numToBinaryArray(cards);
            var value = 0;
            var i = 0;
            while (value == 0 && i < binary.length) {
                value = binary[i];
                if (value != 0) {
                    value = 1 << i;
                }
                i++;
            }
            return value;
        }
    };
})
;