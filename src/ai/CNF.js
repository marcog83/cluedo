/**
 * Created by marco.gobbi on 02/02/2015.
 */
define(function (require) {
    "use strict";
    var Literal = require("./Literal");
    var _ = require("lodash");
    function CNF() {
        this.clauses = [];
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
                //	console.log(this.clauses.length);
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
                            newList = _.union(newList, [clause]);
                            //newList.push(clause);
                        }
                    }
                }
                this.clauses = _.union(this.clauses, newList)

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

            this.clauses
                .reduce(function (result, clause) {
                    return result.concat(clause.literals);
                }, [])
                .forEach(function (literal) {
                    hm[literal.value] = !hm[literal.value] ? 1 : ++hm[literal.value];
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
            this.clauses = _.union(this.clauses, [clause]);
            //this.clauses.push(clause);
        },
        toString: function () {
            var s = this.clauses.map(function (clause) {
                return clause.toString();
            }).toString().replace(/,/g, " ^ ");
            return !s ? "empty" : s;
        }
    };
    return CNF;
});