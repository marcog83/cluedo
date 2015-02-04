define(function (require, exports, module) {
	'use strict';
	var Cluedo = require("./Cluedo");



	function Player(character,controller) {
		this.character = character;
		this.controller = controller;
		this.controller.cPlayer=this;
		this.inGame = true;

	}

	Player.prototype = {
		setHand: function (hand) {
			this.controller.setHand(hand);
		},
		stayOrLeave:function(){
			return this.controller.stayOrLeave(this);
		},
		suggest:function(){
			return this.controller.suggest(this);
		},
		ask: function (questionair, suggestion) {
			return this.controller.ask(questionair, suggestion);
		},
		eliminate: function () {
			this.inGame = false;
		},
		seeCard:function(suggestion,card,asked,couldNotAnswer){
			return this.controller.seeCard(suggestion,card,asked,couldNotAnswer,this);
		},
		observeMove:function(suggestion, questionair, answerer, couldNotAnswer){
			return this.controller.observeMove(suggestion, questionair, answerer, couldNotAnswer);
		},
		toString: function () {
			return "Player " + (Cluedo.players.indexOf(this) + 1);
		},
		get hand(){
			return this.controller.hand;
		},
		setAccusation:function(){
			return this.controller.setAccusation();
		}
	};
	module.exports = Player;
});