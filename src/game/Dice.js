define(function (require, exports, module) {
    'use strict';

    module.exports = {
        roll: function () {
            var d1 = 1 + parseInt(Math.random() * 6);
            var d2 = 1 + parseInt(Math.random() * 6);
            return d1 + d2;
        }
    };
});