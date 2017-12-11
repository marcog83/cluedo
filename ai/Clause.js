const Literal = require("./Literal");

class Clause {
    constructor(literals) {
        this.literals = [];
        if (literals) {
            literals.forEach(this.addLiteral.bind(this));
        }
    }

    /**
     * Removes literal with the specified value from the clause.
     *
     * @param value    Specified value of the literal we want to remove
     * @return    boolean, if such value exists; otherwise false
     */
    removeLiteral(value) {

        let list = [];
        let found = false;
        for (let i = 0; i < this.literals.length; i++) {
            let l = this.literals[i];
            if (l.value !== value) {
                list.push(l);
            } else {
                found = true;
            }
        }
        this.literals = list;
        return found;
        /**/

    }

    getLiterals(value) {
        return this.literals.filter(l => l.value === value);
    }

    addLiteral(value, sign) {
        if (value instanceof Literal) {
            sign = value.sign;
            value = value.value;
        }
        const literal = new Literal(value, sign);
        const contains = this.literals.filter(l => l.value === literal.value && l.sign === literal.sign)[0];

        if (!contains) {
            this.literals.push(literal);
        }
    }

    isEmpty() {
        return this.literals.length === 0;
    }

    toString() {
        if (this.isEmpty()) {
            return "()";
        }
        let s = " (" + this.literals[0].toString();
        for (let i = 1; i < this.literals.length; i++) {
            s += " v " + this.literals[i].toString();
        }
        s += ") ";
        return s;
    }

    equals(clause) {
        return this.toString() === clause.toString();
    }
}

module.exports = Clause;