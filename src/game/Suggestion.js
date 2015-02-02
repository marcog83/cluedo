define(function (require, exports, module) {
    'use strict';
    var Cluedo = require("./Cluedo");

    function Suggestion(player, game) {
        this.room = player.character.room;
        this.player = player;

    }

    Suggestion.prototype = {
        suspectListener: function (name) {

            for (var s in Cluedo.suspects)
                if (s.toString().equals(name)) this.suspect = s;
        },
        weaponListener: function (name) {
            for (var w in Cluedo.weapons)
                if (w.equals(name)) this.weapon = w;
        },
        callInSuspect: function () {
            if (this.suspect.inRoom) this.suspect.exitRoom(null);
            else {
                Cluedo.board.squareAt(this.suspect.location).setOccupant(null);
                this.suspect.setLocation(null);
            }
            this.suspect.enterRoom(this.room);
        },
        questionPlayers: function () {

            var index = Cluedo.players.indexOf(this.player) + 1;
            if (index == Cluedo.players.length) index = 0;
            var asked = Cluedo.players[index];
            var card;
            console.log("No one could help you. Interesting..");
            while (!asked.equals(this.player)) {
                card = asked.ask(this.weapon, this.suspect, this.room);
                if (card != null) {
                    this.player.evidenceSheet.seeCard(card);
                    console.log("Shown " + card.toString());
                    break;
                }
                //Increments count, resets if exceeding player count.
                if (++index == Cluedo.players.length) index = 0;
                asked = Cluedo.players[index];
            }

        }
    };
    module.exports = Suggestion;
});