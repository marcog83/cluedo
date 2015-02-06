/**
 * Created by marco.gobbi on 02/02/2015.
 */// Help Node out by setting up define.
if (typeof exports === 'object' && typeof define !== 'function') {
    var define = function (factory) {
        factory(require, exports, module);
    };
}
define(function (require, exports, module) {
    "use strict";
    function Literal(value, sign) {
        this.value = value;
        this.sign = sign;
        this.toString = function () {
            var s = "";
            if (!sign) {
                s += "!";
            }
            return s + value.toString();
        }
    }

    module.exports = Literal;
});