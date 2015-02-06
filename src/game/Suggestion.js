// Help Node out by setting up define.
if (typeof exports === 'object' && typeof define !== 'function') {
    var define = function (factory) {
        factory(require, exports, module);
    };
}
define(function (require, exports, module) {
    'use strict';
    var bw = require("../bitwise/bw");
    var Cluedo = require("./Cluedo");

    var _ = require("lodash");
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
            /*var nPlayers = Cluedo.players.length;
             var disproved = false;
             var answerer, couldNotAnswer = [];
             for (var i = 1; i < nPlayers; i++) {
             var askedPlayer = Cluedo.players[i];
             if (disproved) {
             continue;
             }
             var card = askedPlayer.ask(player, params);
             if (card != null) {
             answerer = askedPlayer;
             disproved = true;
             } else {
             couldNotAnswer.push(askedPlayer);
             }
             }*/
            if (card) {

                player.hasAccusation = false;
                player.seeCard(params, card, answerer, couldNotAnswer);
                Cluedo.players.forEach(function (oplayer) {
                    oplayer.observeMove(params, player, answerer, couldNotAnswer);
                }.bind(this));
                //
                message = answerer.toString() + " can help you! => " + card;
            } else {
                player.hasAccusation = true;
            }
            return card
        }
    };
    module.exports = Suggestion;
});