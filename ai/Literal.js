class Literal {
    constructor(value, sign = true) {
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

    equals(obj) {
        if (!obj) return false;
        if (this === obj) return true;
        return (this.sign === obj.sign && this.value === obj.value)
    }
}

module.exports = Literal;