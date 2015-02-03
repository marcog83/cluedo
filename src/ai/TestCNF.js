/**
 * Created by marco.gobbi on 03/02/2015.
 */
define(function (require) {
	"use strict";
	var CNF = require("./CNF");
	var Literal = require("./Literal");
	var Clause = require("./Clause");

	function fillClauses() {
		var cnf = new CNF();
		var l = [];
		l.add(new Literal("A", true));
		l.add(new Literal("B", true));
		l.add(new Literal("C", true));
		l.add(new Literal("D", true));
		var c1 = new Clause(l);
		cnf.addClause(c1);
		l = [];
		l.add(new Literal("A", false));
		l.add(new Literal("C", true));
		//l.add(new Literal("E", true));
		var c2 = new Clause(l);
		cnf.addClause(c2);
		l = [];
		l.add(new Literal("B", false));
		l.add(new Literal("C", false));
		l.add(new Literal("D", true));
		l.add(new Literal("F", true));
		var c3 = new Clause(l);
		cnf.addClause(c3);
		l = [];
		l.add(new Literal("D", false));
		l.add(new Literal("A", true));
		l.add(new Literal("G", true));
		var c4 = new Clause(l);
		cnf.addClause(c4);
		l = [];
		l.add(new Literal("G", true));
		l.add(new Literal("C", true));
		var c5 = new Clause(l);
		cnf.addClause(c5);
		return cnf;
	}

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
	};
	function TestCNF() {
		var cnf = fillClauses2();
		console.log(cnf.toString());
		cnf.addNewFact("B11", true);
		console.log("addNewFact:","B11",true);
		console.log(cnf.toString());
		cnf.updateCNF();
		console.log(cnf.toString());
	}

	return TestCNF;
});