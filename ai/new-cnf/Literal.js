var Literal = function(name,sign=true) {
    this.name = name;
    this.isNegate = !sign;
    this.toString=()=>{
        let s = "";
        if (this.isNegate) {
            s += "¬";
        }
        return s + this.name.toString();
    }
};

module.exports = Literal;