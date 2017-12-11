

var CNF = function() {
    this.formula = [] ;
    var scope = this;
    this.addClause = function(clause){
        scope.formula.push(clause);
        return scope;
    };
    this.isEmpty = function(){
        return scope.formula.length == 0;
    };
    this.containsEmpty = function(){
        for(var x in scope.formula){
            if (scope.formula[x].isEmpty())
                return true;
        }
        return false;
    };
    this.containsUnitClause = function(){
        for(var x in scope.formula){
            if (scope.formula[x].isUnitClause())
                return true;
        }
        return false;
    };
    this.setLiteral = function(targetLiteral, value) {
        value = targetLiteral.isNegate ? !value : value;
        var spliceList = [];
        for(var f in scope.formula) {
            for(var l in scope.formula[f].literals ) {
                var literal = scope.formula[f].literals[l];
                if(literal.name === targetLiteral.name) {
                    var literalValue = literal.isNegate ? !value : value;
//		            console.log('[clause]> ' + literalName + ' = ' + literalValue);
                    if (literalValue) {
                        spliceList.push(f);
                        break;
                    } else {
                        scope.formula[f].literals.splice(l, 1);
                    }
                }
            }
        }
        spliceList.sort(function(a, b) {
            return b - a;
        });
        for (var i in spliceList)
            scope.formula.splice(spliceList[i], 1);
        return scope;
    };
};

module.exports = CNF;