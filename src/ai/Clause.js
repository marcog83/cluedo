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
    var Literal = require("./Literal");
    var _ = require("lodash");

    function Clause(literals) {
        this.literals = [];
        if (literals) {
            literals.forEach(function (literal) {
                this.addLiteral(literal);
            }.bind(this));

        }
    }

    Clause.prototype = {
        removeLiteral: function (value) {
            this.literals = this.literals.filter(function (l) {
                return l.value != value;
            })
        },
        addLiteral: function (value, sign) {
            if (value instanceof Literal) {
                sign = value.sign;
                value = value.value;
            }
            var literal = new Literal(value, sign);
            this.literals = _.union(this.literals, [literal]);
        },
        isEmpty: function () {
            return this.literals.length < 1;
        },
        toString: function () {
            if (this.isEmpty()) {
                return "()";
            }
            var s = " (" + this.literals[0].toString();
            for (var i = 1; i < this.literals.length; i++) {
                s += " v " + this.literals[i].toString();
            }
            s += ") ";
            return s;
        }
    };
    module.exports = Clause;
});