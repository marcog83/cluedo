let CNF = require("./CNF");
let Literal = require("./Literal");
let Clause = require("./Clause");

function DinnerGuests() {
    let cnf = new CNF();
    //Don't invite both Alice and Bob --- start
    cnf.addClause(new Clause([
        new Literal("Alice", false)
        , new Literal("Bob", false)
    ]));
    cnf.addClause(new Clause([
        new Literal("Alice", true)
        , new Literal("Bob", false)
    ]));
    cnf.addClause(new Clause([
        new Literal("Alice", false)
        , new Literal("Bob", true)
    ]));
    //Don't invite both Alice and Bob --- end
    //Invite either Bob or Charlie
    cnf.addClause(new Clause([
        new Literal("Bob", false)
        , new Literal("Charlie", true)
    ]));
    cnf.addClause(new Clause([
        new Literal("Bob", true)
        , new Literal("Charlie", false)
    ]));
    cnf.addClause(new Clause([
        new Literal("Bob", true)
        , new Literal("Charlie", true)
    ]));

    console.log("CNF:", cnf.toString());
    cnf.addNewFact("Alice", false);
    cnf.updateCNF();
    console.log("updateCNF:", cnf.toString());
}

//DinnerGuests ()
/**
 *
 *  Example Problem: Suppose that liars always speak
 what is false, and truth-tellers always speak what is
 true. Further suppose that Amy, Bob, and Cal are each
 either a liar or truth-teller. Amy says, “Bob is a liar.”
 Bob says, “Cal is a liar.” Cal says, “Amy and Bob are
 liars.” Which, if any, of these people are truth-tellers?

 */

function liarTruthTeller() {
    const Amy = "a", Bob = "b", Cal = "c";
    // Liar and truth-teller example test code:
    // var clauses = [{-1, -2}, {2, 1}, {-2, -3}, {3, 2}, {-3, -1}, {-3, -2}, {1, 2, 3}];
    let cnf = new CNF();
    cnf.addClause(new Clause([
        new Literal(Amy, false)
        , new Literal(Bob, false)
    ]));
    cnf.addClause(new Clause([
        new Literal(Bob)
        , new Literal(Amy)
    ]));
    cnf.addClause(new Clause([
        new Literal(Bob, false)
        , new Literal(Cal, false)
    ]));
    cnf.addClause(new Clause([
        new Literal(Cal)
        , new Literal(Bob)
    ]));
    cnf.addClause(new Clause([
        new Literal(Cal, false)
        , new Literal(Amy, false)
    ]));
    cnf.addClause(new Clause([
        new Literal(Cal, false)
        , new Literal(Bob, false)
    ]));
    cnf.addClause(new Clause([
        new Literal(Amy)
        , new Literal(Bob)
        , new Literal(Cal)
    ]));
    console.log("cnf:", cnf.toString());
    const Amy_value = false;

    const Bob_value = true;
    const Cal_value = false;
    cnf.addNewFact(Amy, Amy_value);
    console.log("add New Fact:", Amy, Amy_value);
    console.log("cnf:", cnf.toString());

    cnf.addNewFact(Bob, Bob_value);
    console.log("add New Fact:", Bob, Bob_value);
    console.log("cnf:", cnf.toString());

    cnf.addNewFact(Cal, Cal_value);
    console.log("add New Fact:", Cal, Cal_value);
    console.log("cnf:", cnf.toString());


    //a=false
    //b=true
    //c=false




}


liarTruthTeller();