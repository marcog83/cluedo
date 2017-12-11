let CNF = require("./CNF");
let Literal = require("./Literal");
let Clause = require("./Clause");

var T = [];        // Resultant CNF from setting up literals from I

function unit_propagation(CNF, I) {
    // console.log('CNF : ', CNF.formula[0].literals);
    while (CNF.containsUnitClause()) {
        for (var c in CNF.formula) {
            if (CNF.formula[c].isUnitClause())
                I.push(CNF.formula[c].literals[0]);
        }
        for (var l in I) {
            CNF.setLiteral(I[l], true);
        }
    }
};

function chooseLiteral(CNF) {
    // console.log(CNF.formula[0].literals[0].name);
    return CNF.formula[0].literals[0];
}

function dpll_propagated(CNF) {
    var I = [];        // I is the notation for set of literals either as unit clause or derived after resolutions
    unit_propagation(CNF, I);
    // console.log('here : ',I);
    if (CNF.isEmpty())
        return I;
    else if (CNF.containsEmpty())
        return -1;
    else {
        var l = chooseLiteral(CNF);
        var newCNF = Object.assign({}, CNF);
        newCNF.setLiteral(l, true);
        var L = dpll_propagated(CNF);
        if (L != -1) {
            L = I.concat(L);
            L.push(l);
            return L;
        }
        newCNF = Object.assign({}, CNF);
        newCNF.setLiteral(l, false);
        L = dpll_propagated(newCNF);
        if (L != -1) {
            L = I.concat(L);
            l.isNegate = !l.isNegate;
            L.push(l);
            return L;
        }
        return -1;
    }

}

/**
 *
 *  Example Problem: Suppose that liars always speak
 what is false, and truth-tellers always speak what is
 true. Further suppose that Amy, Bob, and Cal are each
 either a liar or truth-teller. Amy says, “Bob is a liar.”
 Bob says, “Cal is a liar.” Cal says, “Amy and Bob are
 liars.” Which, if any, of these people are truth-tellers?

 */
//int[][] clauses = {{-1, 3}, {-2, -3}, {3, 2}, {-3, 2,-1}, {-2, 3}, {1,3}};
var Amy = "Amy";
var Bob = "Bob";
var Cal = "Cal";
var testCNF = new CNF();

function addLiteral(clause, literal) {
    clause.addLiteral(literal);
    return clause;
}

testCNF.addClause([
        new Literal(Amy, true)
        , new Literal(Bob, true)
    ].reduce(addLiteral, new Clause()))
    .addClause([
        new Literal(Bob)
        , new Literal(Amy)

    ].reduce(addLiteral, new Clause()))
    .addClause([
        new Literal(Bob,true)
        , new Literal(Cal,true)

    ].reduce(addLiteral, new Clause()))
    .addClause([
        new Literal(Cal),
        new Literal(Bob)


    ].reduce(addLiteral, new Clause()))
    .addClause([
        new Literal(Cal,true),
        new Literal(Amy,true)
    ].reduce(addLiteral, new Clause()))
    .addClause([
        new Literal(Cal,true),
        new Literal(Bob,true)


    ].reduce(addLiteral, new Clause()))
    .addClause([
        new Literal(Amy),
        new Literal(Bob),
        new Literal(Cal)


    ].reduce(addLiteral, new Clause()))


//unit_propagation(testCNF);
var ans = dpll_propagated(testCNF);
if (ans === -1) console.log('unsatisiable');

else {
    for (var i in ans) {
        console.log('Set ', ans[i].name, ' as', !ans[i].isNegate);
    }
}