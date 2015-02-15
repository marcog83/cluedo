define(function (require, exports, module) {
    'use strict';
    var Cluedo = require("./Cluedo");
    var _ = require("lodash");
    var bw = require("../bitwise/bw");
    var Suggestion = {
        questionPlayers: function (params) {

            var player = params.player;
            var message = "No one could help you. Interesting..";
            player.hasAccusation = true;
            // players but the current
            var otherPlayers = Cluedo.players.filter(function (oplayer) {
                return oplayer != player
            });
            //
            //remember ask
            //
            var _memoizeAsk = _.memoize(function (oplayer) {
                return oplayer.ask(player, params);
            });
            var response = otherPlayers
                .filter(_memoizeAsk)
                .map(function (oplayer) {
                    var card = _memoizeAsk(oplayer);
                    return {
                        couldNotAnswer: otherPlayers.filter(function (p) {
                            return p != oplayer;
                        }),
                        answerer: oplayer,
                        card: card
                    }
                })[0];
            var card = response && response.card;
            var answerer = response && response.answerer;
            var couldNotAnswer = response && response.couldNotAnswer;
            var result = {
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

                message = answerer.toString() + " can help you! => " + card;
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
});