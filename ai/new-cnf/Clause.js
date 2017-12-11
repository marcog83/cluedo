
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
};

module.exports = Clause;