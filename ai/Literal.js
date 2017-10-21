class Literal {
    constructor(value, sign) {
        this.value = value;
        this.sign = sign;

    }

    toString() {
        let s = "";
        if (!this.sign) {
            s += "!";
        }
        return s + this.value.toString();
    }
}

module.exports = Literal;