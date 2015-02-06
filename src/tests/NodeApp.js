/**
 * Created by marco.gobbi on 03/02/2015.
 */
// Help Node out by setting up define.


var fs = require("fs");
var Application = require("./ApplicationNode");



function main(){
    var results = JSON.parse(fs.readFileSync('results.json', 'utf8'));
    Application.main(results)
        .then(Application.main)
        .then(Application.main)
        .then(Application.main)
        .then(Application.main)
        .then(function (results) {
            fs.writeFile("results.json", JSON.stringify(results), function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("The file was saved!");

                }
            });
        });
}

main()