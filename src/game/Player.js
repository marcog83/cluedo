define(function (require, exports, module) {
    'use strict';
    var Cluedo = require("./Cluedo");

   // var MovementController = require("../movement/MovementController");

    function Player(config) {
        this.character = config.id;
        this.config = config;
        this.controller = config.controller;
        this.controller.player = this;
        this.movement = config.movement;//MovementController.create(this.config);
        this.inGame = true;
    }

    Player.prototype = {
        gotoRoom: function (room) {
            return this.movement.gotoRoom(room);
        },
        get location() {
            return this.movement.location;
        },
        get room(){
            return this.movement.room;
        },
        get inRoom() {
            return this.movement.inRoom
        },
        get desiredRoom() {
            return this.controller.desiredRoom
        },
        setHand: function (hand) {
            this.controller.setHand(hand);
        },
        stayOrLeave: function () {
            return this.controller.stayOrLeave(this);
        },
        suggest: function () {
            return this.controller.suggest(this);
        },
        ask: function (questionair, suggestion) {
            return this.controller.ask(questionair, suggestion);
        },
        eliminate: function () {
            this.inGame = false;
        },
        seeCard: function (suggestion, card, asked, couldNotAnswer) {
            return this.controller.seeCard(suggestion, card, asked, couldNotAnswer, this);
        },
        observeMove: function (suggestion, questionair, answerer, couldNotAnswer) {
            return this.controller.observeMove(suggestion, questionair, answerer, couldNotAnswer);
        },
        toString: function () {
            return "Player " + (Cluedo.players.indexOf(this) + 1);
        },
        get hand() {
            return this.controller.hand;
        },
        set hand(value) {
            return this.controller.hand = value;
        },

        setAccusation: function () {
            return this.controller.setAccusation();
        },
        getFormattedAccusation:function(){
            return this.controller.getFormattedAccusation();
        }
    };
    module.exports = Player;
});