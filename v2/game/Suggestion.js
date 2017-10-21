let Cluedo = require("./Cluedo");
let memoize = require("../utils/memoize");
let bw = require("../bitwise/bw");
let { fromNumberToName} = require("../utils/utils");

let Suggestion = {
    questionPlayers: function (params) {

        let player = params.player;
        let message = "No one could help you. Interesting..";
        player.hasAccusation = true;
        // players but the current
        let otherPlayers = Cluedo.players.filter(function (oplayer) {
            return oplayer !== player
        });
        //
        //remember ask
        //
        let _memoizeAsk = memoize(function (oplayer) {
            return oplayer.ask(player, params);
        });
        let response = otherPlayers
            .filter(_memoizeAsk)
            .map(function (oplayer) {
                let card = _memoizeAsk(oplayer);
                return {
                    couldNotAnswer: otherPlayers.filter(function (p) {
                        return p !== oplayer;
                    }),
                    answerer: oplayer,
                    card: card
                }
            })[0];
        let card = response && response.card;
        let answerer = response && response.answerer;
        let couldNotAnswer = response && response.couldNotAnswer;
        let result = {
            suggestion: params,
            card: card,

            couldNotAnswer: couldNotAnswer
        };
        if (card) {

            player.hasAccusation = false;
            player.seeCard(params, card, answerer, couldNotAnswer);
            Cluedo.players.forEach(function (oplayer) {
                oplayer.observeMove(params, player, answerer, couldNotAnswer);
            }.bind(this));
            //
            result.answerer = answerer;

            message = answerer.toString() + " can help you! => " +  fromNumberToName(card);
        } else {
            player.hasAccusation = true;
            console.log("wow!");
            console.log("hand", bw.numToBinaryArray(player.hand));
            console.log("sugg", bw.numToBinaryArray(params.suspect | params.weapon | params.room));
            console.log("solu", bw.numToBinaryArray(Cluedo.solution));
        }
        console.log(message);
        return result;
    }
};
module.exports = Suggestion;