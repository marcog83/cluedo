// Help Node out by setting up define.
if (typeof exports === 'object' && typeof define !== 'function') {
    var define = function (factory) {
        factory(require, exports, module);
    };
}
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