const Literal = require("./Literal");

class CNF {
    constructor() {
        this.clauses = [];
    }

    /**
     * Updates CNF using the given knowledge.
     * @param value    Value of the literal whose sign we explicitly know
     * @param sign    Sign of the known literal
     * @throws Error    if an empty clause is generated
     *                                (contradiction is found)
     */
    addNewFact(value, sign) {
        //value is known Literal;
        if (value instanceof Literal) {
            sign = value.sign;
            value = value.value;
        }
        if (!sign) {
            for (let i = 0; i < this.clauses.length; i++) {
                let c = this.clauses[i];
                c.removeLiteral(value);
                if (c.isEmpty()) {
                    throw new Error("ArithmeticException");
                }
            }

        } else {
            let newList = [];
            // delete whole c from clauses if l = true in c
            for (let i = 0; i < this.clauses.length; i++) {
                let c = this.clauses[i];
                let clauseOK = true;
                let literals = c.literals;
                for (let j = 0; j < literals.length; j++) {
                    let l = literals[j];
                    if (l.value === value) {
                        clauseOK = false;
                        break;
                    }
                }
                if (clauseOK) {
                    newList.push(c);
                }
            }

            this.clauses = newList;
        }
    }

    /**
     * Searches for facts (atomic clauses) in CNF.
     * @return    Array of facts (Literals with their values) in CNF
     */
    getNewFacts() {
        let facts = [];
        for (let i = 0; i < this.clauses.length; i++) {
            let c = this.clauses[i];
            if (c.literals.length === 1) {
                // found new fact
                facts.push(c.literals[0]);
            }
        }
        return facts;
    }

    /**
     * Updates CNF resolving facts it gets from atomic clauses recursively.
     */
    updateCNF() {
        let facts = this.getNewFacts();

        while (facts.length > 0) {
            for (let i = 0; i < facts.length; i++) {
                let l = facts[i];
                this.addNewFact(l);
                facts =this.getNewFacts()// facts.concat();

            }
        }

    }

    /**
     * Removes all clauses from the CNF.
     */
    clear() {
        this.clauses = [];
    }

    /**
     * Returns all literals in the CNF (contained in at least one clause)
     * with their quantity.
     * @return    Object with Literals and their quantities.
     */
    getAllLiterals() {
        let hm = new Map();//new HashMap<Literal<T>, Integer>();
        for (let i = 0; i < this.clauses.length; i++) {
            let c = this.clauses[i];

            for (let j = 0; j < c.literals.length; j++) {
                let l = c.literals[j];

                if (hm.has(l)) {
                    let oldValue = hm.get(l);
                    hm.set(l, oldValue + 1);
                } else {
                    hm.set(l, 1);
                }
            }


        }

        return hm;
    }

    /**
     * adds given clause to the CNF
     * @param clause    clause to add to the CNF
     */
    addClause(clause) {
        const contains = this.clauses.filter(c => c.equals(clause))[0];
        if (!contains) {
            this.clauses.push(clause);
        }
    }

    toString() {
        let s = this.clauses.map(function (clause) {
            return clause.toString();
        }).toString().replace(/,/g, " ^ ");
        return !s ? "empty" : s;
    }
}

module.exports = CNF;