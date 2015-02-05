define(function (require, exports, module) {
	'use strict';
	var Cluedo = require("./Cluedo");
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
			if (response && response.card) {
				player.hasAccusation = false;
				player.seeCard(params, response.card, response.answerer, response.couldNotAnswer);
				Cluedo.players.forEach(function (oplayer) {
					oplayer.observeMove(params, player, response.answerer, response.couldNotAnswer);
				}.bind(this));
				//
				message = response.answerer.toString() + " can help you! => " + response.card;
			} else {
				console.log("wow!")
			}
			console.log(message);
			return response && response.card
		}
	};
	module.exports = Suggestion;
});