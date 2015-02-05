/**
 * Created by marco.gobbi on 02/02/2015.
 */
define(function (require) {
	"use strict";
	var SearchSpace = require("./SearchSpace");
	var Clause = require("./Clause");
	var PlayerAssumption = require("./PlayerAssumption");
	//
	var Cluedo = require("../game/Cluedo");
	var Cards = require("../bitwise/Cards");
	var bw = require("../bitwise/bw");
	var AIPlayer = {
		create: function () {
			return {
				shownCards: {},
				assumptions: {},
				hand: 0,
				searchSpace: new SearchSpace(Cluedo.suspects, Cluedo.weapons, Cluedo.rooms),
				setHand: function () {
					this.assumptions = [];
					var otherPlayers = Cluedo.players.filter(function (player) {
						return player != this.player
					}.bind(this));
					//
					otherPlayers.forEach(function (player) {
						this.assumptions.push(new PlayerAssumption(player, Cluedo.cards));
						var tmpHM = {};
						bw.binaryForEach(this.hand, function (value) {
							tmpHM[value] = false;
						});
						this.shownCards[player] = tmpHM;
					}.bind(this));
					//
					bw.binaryForEach(this.hand, function (card) {
						this.searchSpace.update(card);
						this.assumptions.forEach(function (assumption) {
							assumption.update(card);
						}.bind(this));
					}.bind(this));
					this.assumptions.forEach(function (assumption) {
						assumption.onCertainAdded.connect(this.observeAssumption.bind(this));
					}.bind(this));
					this.searchSpace.onChanged.connect(function (card) {
						this.assumptions.forEach(function (assumption) {
							assumption.update(card);
						});
					}.bind(this));
					/**/
				},
				observeAssumption: function (card,_, cAssumption) {
					this.searchSpace.update(card);
					this.assumptions.forEach(function (assumption) {
						if (assumption != cAssumption) {
							assumption.update(card);
						}
					});
				},
				ask: function (questionair, suggestion) {
					this.shownCards[questionair] = this.shownCards[questionair] || {};
					var card = null;
					if (this.hand & suggestion.suspect) {
						this.shownCards[questionair][suggestion.suspect] = true;
						card = suggestion.suspect;
					}
					if (this.hand & suggestion.weapon) {
						this.shownCards[questionair][suggestion.weapon] = true;
						card = suggestion.weapon;
					}
					if (this.hand & suggestion.room) {
						this.shownCards[questionair][suggestion.room] = true;
						card = suggestion.room;
					}
					return card;
				},
				seeCard: function (suggestion, card, answerer, _couldNotAnswer) {
					this.couldNotAnswer(suggestion, _couldNotAnswer);
					var pa = this.getPlayerAssumption(answerer);
					pa.addCertainHandCard(card);
				},
				couldNotAnswer: function (suggestion, couldNotAnswer) {
					couldNotAnswer
						.filter(function (player) {
							return player != this.player
						}.bind(this))
						.forEach(function (player, i) {
							var pa = this.getPlayerAssumption(player);
							pa.removePossibleCard(suggestion.suspect);
							pa.removePossibleCard(suggestion.room);
							pa.removePossibleCard(suggestion.weapon);
						}.bind(this));
				},
				getPlayerAssumption: function (player) {
					return this.assumptions.filter(function (pa) {
						return pa.player == player;
					})[0];
				},
				suggest: function (player) {
					var suggestion = {
						suspect: this.searchSpace.suspect,
						weapon: this.searchSpace.weapon,
						room: this.searchSpace.room,
						player: player
					};
					console.log(player.toString(), " go to", this.searchSpace.room, "!");
					console.log(player.toString(), "=>", [
						suggestion.suspect,
						suggestion.weapon,
						suggestion.room
					]);
					return Promise.resolve(suggestion);
				},
				getRanks: function () {
					var cards = this.searchSpace.getPossibleCards();
					var ranks = cards.reduce(function (result, card) {
						result[card] = 1;
						return result;
					}, {});
				},
				/**
				 * This method is called when a player show another player a card hidden from
				 * this player.
				 *
				 * @param suggestion subjected suggestion
				 * @param questionair asking player
				 * @param answerer answering player
				 * @param couldNotAnswer set of players which could not answer

				 */
				observeMove: function (suggestion, questionair, answerer, couldNotAnswer) {
					this.couldNotAnswer(suggestion, couldNotAnswer);
					if (answerer == null || this.player == answerer) { // Not interesting
						return;
					}
					var pa = this.getPlayerAssumption(answerer);
					pa.addAnsweredSuggestion(suggestion);
				},
				stayOrLeave: function (player) {
					//TODO come automatizzare scelta!!!
					var desiredRoom = this.searchSpace.room;
					if (player.hasAccusation) {
						console.log(player.toString(), "=> I Know who is the Murderer!");
						desiredRoom = Cards.POOL;
					}
					if (player.room == desiredRoom) {
						return Promise.resolve(true);
					} else {
						return Promise.reject(desiredRoom);
					}
				},
				setAccusation: function () {
					var accusation = this.searchSpace.getAccusation();
					console.log(this.player.toString(), "=> I accuse:", accusation);
					return Promise.resolve(accusation);
				}
			};
		}
	};
	//AIPlayer.prototype = {
	//	setHand: function () {
	//		this.assumptions = [];
	//		var otherPlayers = Cluedo.players.filter(function (player) {
	//			return player != this.player
	//		}.bind(this));
	//		//
	//		otherPlayers.forEach(function (player) {
	//			this.assumptions.push(new PlayerAssumption(player, Cluedo.cards));
	//			var tmpHM = {};
	//			bw.binaryForEach(this.hand, function (value) {
	//				tmpHM[value] = false;
	//			});
	//			this.shownCards[player] = tmpHM;
	//		}.bind(this));
	//		//
	//		bw.binaryForEach(this.hand, function (card) {
	//			this.searchSpace.update(card);
	//			this.assumptions.forEach(function (assumption) {
	//				assumption.update(card);
	//			}.bind(this));
	//		}.bind(this));
	//		this.assumptions.forEach(function (assumption) {
	//			assumption.onCertainAdded.connect(this.observeAssumption.bind(this));
	//		}.bind(this));
	//		this.searchSpace.onChanged.connect(function (card) {
	//			this.assumptions.forEach(function (assumption) {
	//				assumption.update(card);
	//			});
	//		}.bind(this));
	//		/**/
	//	},
	//	observeAssumption: function (card) {
	//		this.searchSpace.update(card);
	//		this.assumptions.forEach(function (assumption) {
	//			assumption.update(card);
	//		});
	//	},
	//	ask: function (questionair, suggestion) {
	//		this.shownCards[questionair] = this.shownCards[questionair] || {};
	//		var card = null;
	//		if (this.hand & suggestion.suspect) {
	//			this.shownCards[questionair][suggestion.suspect] = true;
	//			card = suggestion.suspect;
	//		}
	//		if (this.hand & suggestion.weapon) {
	//			this.shownCards[questionair][suggestion.weapon] = true;
	//			card = suggestion.weapon;
	//		}
	//		if (this.hand & suggestion.room) {
	//			this.shownCards[questionair][suggestion.room] = true;
	//			card = suggestion.room;
	//		}
	//		return card;
	//	},
	//	eliminate: function () {
	//		this.inGame = false;
	//	},
	//	seeCard: function (suggestion, card, answerer, _couldNotAnswer) {
	//		this.couldNotAnswer(suggestion, _couldNotAnswer);
	//		var pa = this.getPlayerAssumption(answerer);
	//		pa.addCertainHandCard(card);
	//	},
	//	couldNotAnswer: function (suggestion, couldNotAnswer) {
	//		couldNotAnswer
	//			.filter(function (player) {
	//				return player != this.player
	//			}.bind(this))
	//			.forEach(function (player, i) {
	//				var pa = this.getPlayerAssumption(player);
	//				pa.removePossibleCard(suggestion.suspect);
	//				pa.removePossibleCard(suggestion.room);
	//				pa.removePossibleCard(suggestion.weapon);
	//			}.bind(this));
	//	},
	//	getPlayerAssumption: function (player) {
	//		return this.assumptions.filter(function (pa) {
	//			return pa.player == player;
	//		})[0];
	//	},
	//	suggest: function (player) {
	//		var suggestion = {
	//			suspect: this.searchSpace.suspect,
	//			weapon: this.searchSpace.weapon,
	//			room: this.searchSpace.room,
	//			player: player
	//		};
	//		console.log(player.toString(), " go to", this.searchSpace.room, "!");
	//		console.log(player.toString(), "=>", [
	//			suggestion.suspect,
	//			suggestion.weapon,
	//			suggestion.room
	//		]);
	//		return Promise.resolve(suggestion);
	//	},
	//	getRanks: function () {
	//		var cards = this.searchSpace.getPossibleCards();
	//		var ranks = cards.reduce(function (result, card) {
	//			result[card] = 1;
	//			return result;
	//		}, {});
	//	},
	//	/**
	//	 * This method is called when a player show another player a card hidden from
	//	 * this player.
	//	 *
	//	 * @param suggestion subjected suggestion
	//	 * @param questionair asking player
	//	 * @param answerer answering player
	//	 * @param couldNotAnswer set of players which could not answer
	//
	//	 */
	//	observeMove: function (suggestion, questionair, answerer, couldNotAnswer) {
	//		this.couldNotAnswer(suggestion, couldNotAnswer);
	//		if (answerer == null || this.player == answerer) { // Not interesting
	//			return;
	//		}
	//		var pa = this.getPlayerAssumption(answerer);
	//		pa.addAnsweredSuggestion(suggestion);
	//	},
	//	stayOrLeave: function (player) {
	//		//TODO come automatizzare scelta!!!
	//		var desiredRoom = this.searchSpace.room;
	//		if (player.hasAccusation) {
	//			console.log(player.toString(), "=> I Know who is the Murderer!");
	//			desiredRoom = Cards.POOL;
	//		}
	//		if (player.room == desiredRoom) {
	//			return Promise.resolve(true);
	//		} else {
	//			return Promise.reject(desiredRoom);
	//		}
	//	},
	//	setAccusation: function () {
	//		var accusation = this.searchSpace.getAccusation();
	//		console.log(this.player.toString(), "=> I accuse:", accusation);
	//		return Promise.resolve(accusation);
	//	}
	//};
	return AIPlayer;
});