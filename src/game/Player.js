define(function (require, exports, module) {
    'use strict';
    var EvidenceSheet = require("./EvidenceSheet");
    var Cluedo = require("./Cluedo");
    var ToRoom = require("./ToRoom");
    var Room = require("../card/Room");
    var utils = require("../utils/utils");

    function Player(character) {
        this.character = character;
        this.inGame = true;
    }

    Player.prototype = {
        setHand: function (hand) {
            this.hand = hand;
            this.evidenceSheet = new EvidenceSheet();
            for (var card in this.hand)
                this.evidenceSheet.seeCard(card);
        },
        reviewEvidenceSheet: function () {
            for (var s in this.evidenceSheet.suspects)
                console.log("The murderer could have been " + s);
            for (var w in this.evidenceSheet.weapons)
                console.log("The murder weapon could have been the " + w);
            for (var r in this.evidenceSheet.rooms)
                if (r != Room.POOL)
                    console.log("The location could have been the " + r);
            console.log("Your hand: ");
            for (var c in this.hand)
                console.log(c.toString() + ". ");
            console.log();
        },
        moveToRoom: function (string) {
            for (var room in Cluedo.rooms)
                if (room.toString().equals(string))
                    new ToRoom(this, room);
        },
        ask: function (w, s, r) {
            this.hand = utils.shuffle(this.hand);
            for (var c in this.hand) {
                if (c == w || c == s || c == r) return c;
            }
            return null;
        },
        moveToSquare: function (point) {
            new ToSquare(this, point);
        },
        eliminate: function () {
            this.inGame = false;
        },
        toString: function () {
            return "Player " + (Cluedo.players.indexOf(this) + 1);
        }

    };
    module.exports = Player;
});