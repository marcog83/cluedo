let CNF = require("./CNF");
let Literal = require("./Literal");
let Clause = require("./Clause");


function fillClauses2() {
    let cnf = new CNF();
    let l = [];
    l.push(new Literal("P21", false));
    l.push(new Literal("B11", true));
    let c1 = new Clause(l);
    cnf.addClause(c1);
    l = [];
    l.push(new Literal("B11", false));
    l.push(new Literal("P12", true));
    l.push(new Literal("P21", true));
    let c2 = new Clause(l);
    cnf.addClause(c2);
    l = [];
    l.push(new Literal("P12", false));
    l.push(new Literal("B11", true));
    let c3 = new Clause(l);
    cnf.addClause(c3);
    l = [];
    l.push(new Literal("B11", false));
    let c4 = new Clause(l);
    cnf.addClause(c4);
    l = [];
    l.push(new Literal("P12", true));
    let c5 = new Clause(l);
    cnf.addClause(c5);
    return cnf;
}


const value=true;

let cnf = fillClauses2();
console.log(cnf.toString());
cnf.addNewFact("B11", value);
console.log("add New Fact:", "B11", value);
console.log("cnf:",cnf.toString());
cnf.updateCNF();

console.log("updateCNF:",cnf.toString());
cnf.updateCNF();
console.log("updateCNF:",cnf.toString());