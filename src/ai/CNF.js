/**
 * Created by marco.gobbi on 02/02/2015.
 */
define(function (require) {
	"use strict";
	var TruthValues = require("./TruthValues");

	function CNF() {
		this.clauses = [];
		this.value = TruthValues.UNKNOWN;
	}

	CNF.prototype = {
		addNewFact: function (value, sign) {
			if (!sign) {
				this.clauses.forEach(function (c) {
					c.removeLiteral(value);
				});
			} else {
				var newList = [];
				this.clauses.forEach(function (c) {
					var clauseOK = true;
					c.literals.forEach(function (l) {
						if (l.value == value) {
							clauseOK = false;
							//break;
						}
						if (clauseOK) {
							newList.push(c);
						}
					});
				});
				this.clauses = newList;
			}
		},
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
					facts = _.union(facts, this.getNewFacts());
				}.bind(this));
			}
		},
		getAllLiterals: function () {
			var hm = {};
			this.clauses.forEach(function (c) {
				c.literals.forEach(function (l) {
					if (hm[l]) {
						var oldValue = hm[l];
						hm[l] = oldValue + 1;
					} else {
						hm[l] = 1;
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
		}
	};
	return CNF;
});