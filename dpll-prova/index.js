var {CnfFormula,Solver} = require('./src/dpll');
var formula = new CnfFormula();
// var clauses = [
// {-1, -2},
// {2, 1},
// {-2, -3},
// {3, 2},
// {-3, -1},
// {-3, -2},
// {1, 2, 3}];
var a = "a", b = "b", c = "c";

formula.openClauseNot(a).orNot(b).close()
    .openClause(b).or(a).close()
    .openClauseNot(b).orNot(c).close()
    .openClause(c).or(b).close()
    .openClauseNot(c).orNot(a).close()
    .openClauseNot(c).orNot(b).close()
    .openClause(a).or(b).or(c).close();

var solver = new Solver(formula);
var solution = solver.solve();
console.log(solution);