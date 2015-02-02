/**
 * Created by marco.gobbi on 02/02/2015.
 */
define(function (require) {
	"use strict";
	var Literal = require("./Literal");

	function Clause(literals) {
		if (literals) {
			this.literals = _.uniq(literals).map(function (l) {
				return new Literal(l);
			});
		} else {
			this.literals = [];
		}
	}

	Clause.prototype = {
		removeLiteral: function (value) {
			this.literals = this.literals.filter(function (l) {
				return l.value != value;
			})
		},
		addLiteral: function (value, sign) {
			var literal = new Literal(value, sign);
			this.literals = _.union(this.literals, [literal]);
		}
	};
	return Clause;
});