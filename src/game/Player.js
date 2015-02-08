define(function (require, exports, module) {
    'use strict';
    var Cluedo = require("./Cluedo");

    function Player(character, controller) {
        this.character = character;
        this.controller = controller;
        this.controller.player = this;
        this.inGame = true;
        this.inRoom = false;
    }

    Player.prototype = {
        enterRoom: function (room) {
            // room.addOccupant(this);
            this.inRoom = true;
            this.room = room;
        },
        exitRoom: function (toExit) {
            //this.room.removeOccupant(this);
            this.inRoom = false;
            this.location = toExit;
            this.room = null;
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
        }
    };
    module.exports = Player;
});