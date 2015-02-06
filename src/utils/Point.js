// Help Node out by setting up define.
if (typeof exports === 'object' && typeof define !== 'function') {
    var define = function (factory) {
        factory(require, exports, module);
    };
}
define(function (require, exports, module) {
    'use strict';
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }

    module.exports = Point;
});