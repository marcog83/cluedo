/**
 * Created by marco.gobbi on 03/02/2015.
 */
define(function (require) {
    "use strict";
    var CNF = require("./CNF");
    var Literal = require("./Literal");
    var Clause = require("./Clause");


    function fillClauses2() {
        var cnf = new CNF();
        var l = [];
        l.push(new Literal("P21", false));
        l.push(new Literal("B11", true));
        var c1 = new Clause(l);
        cnf.addClause(c1);
        l = [];
        l.push(new Literal("B11", false));
        l.push(new Literal("P12", true));
        l.push(new Literal("P21", true));
        var c2 = new Clause(l);
        cnf.addClause(c2);
        l = [];
        l.push(new Literal("P12", false));
        l.push(new Literal("B11", true));
        var c3 = new Clause(l);
        cnf.addClause(c3);
        l = [];
        l.push(new Literal("B11", false));
        var c4 = new Clause(l);
        cnf.addClause(c4);
        l = [];
        l.push(new Literal("P12", true));
        var c5 = new Clause(l);
        cnf.addClause(c5);
        return cnf;
    }
    function TestCNF() {
        var cnf = fillClauses2();
        console.log(cnf.toString());
        cnf.addNewFact("B11", true);
        console.log("add New Fact:", "B11", true);
        console.log(cnf.toString());
        cnf.updateCNF();
        console.log(cnf.toString());
    }

    return TestCNF;
});