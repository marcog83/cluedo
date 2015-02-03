/**
 * Created by marco.gobbi on 02/02/2015.
 */
define(function (require) {
	"use strict";
	var TruthValues = require("./TruthValues");
	var Literal = require("./Literal");

	function CNF() {
		this.clauses = [];
		this.value = TruthValues.UNKNOWN;
	}

	CNF.prototype = {
		/**
		 * Updates CNF using the given knowledge.
		 * @param value Value of the literal whose sign we explicitly know
		 * @param sign  Sign of the known literal
		 * @throws ArithmeticException  if an empty clause is generated
		 * (contradiction is found)
		 */
		addNewFact: function (value, sign) {
			//value is known Literal;
			if (value instanceof Literal) {
				sign = value.sign;
				value = value.value;
			}
			if (!sign) {
				this.clauses.forEach(function (c) {
					c.removeLiteral(value);
					if (c.isEmpty()) {
						throw new Error('ArithmeticException');
					}
				});
			} else {
				var newList = [];
				for (var i = 0; i < this.clauses.length; i++) {
					var clauseOK = true;
					var clause = this.clauses[i];
					for (var j = 0; j < clause.literals.length; j++) {
						var l = clause.literals[j];
						if (l.value == value) {
							clauseOK = false;
							break;
						}
						if (clauseOK) {
							newList= _.union(newList,[clause]);
							//newList.push(clause);
						}
					}
				}
				this.clauses = newList;
			}
		},
		/**
		 * Searches for facts (atomic clauses) in CNF.
		 * @return      Array of facts (Literals with their values) in CNF
		 */
		getNewFacts: function () {
			var facts = [];
			this.clauses.forEach(function (c) {
				if (c.literals.length == 1) {
					// found new fact
					facts.push(c.literals[0]);
				}
			});
			return facts;
		},
		updateCNF: function () {
			var facts = this.getNewFacts();

			while (facts.length) {
				facts.forEach(function (l) {
					this.addNewFact(l);
					facts = _.uniq(this.getNewFacts());
				}.bind(this));
			}
		},
		clear: function () {
			this.clauses = [];
		},
		getAllLiterals: function () {
			var hm = {};
			this.clauses.forEach(function (clause) {
				clause.literals.forEach(function (literal) {
					if (hm[literal]) {
						var oldValue = hm[literal];
						hm[literal] = oldValue + 1;
					} else {
						hm[literal] = 1;
					}
				});
			});
			return hm;
		},
		getClauses: function () {
			return this.clauses;
		},
		setClauses: function (clauses) {
			this.clauses = clauses;
		},
		addClause: function (clause) {
			this.clauses.push(clause);
		},
		toString: function () {
			var s = this.clauses.map(function (clause) {
				return clause.toString();
			}).toString().replace(/,/g, " ^ ");
			/*this.clauses.forEach(function (clause) {
			 s += " ^ " + clause;
			 });*/
			return !s ? "empty" : s;
		}
	};
	return CNF;
});