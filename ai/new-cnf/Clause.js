
var Clause = function() {
    this.literals = [];
    var scope = this;
    this.addLiteral = function(literal){
        scope.literals.push(literal);
    };
    this.isEmpty = function(){
        return scope.literals.length === 0 ;
    };
    this.isUnitClause = function(){
        return scope.literals.length === 1 ;
    };
    this.toString=()=>{
        if (this.isEmpty()) {
            return "()";
        }
        let s = " (" + this.literals[0].toString();
        for (let i = 1; i < this.literals.length; i++) {
            s += " ∨ " + this.literals[i].toString();
        }
        s += ") ";
        return s;
    }
};

module.exports = Clause;