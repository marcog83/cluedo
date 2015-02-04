define(function (require, exports, module) {
    'use strict';
    var Cluedo = require("./Cluedo");

    function Suggestion(player) {
        this.room = player.character.room;
        this.suspect = player;
        this.weapon = player;
        this.player = player;
    }

    Suggestion.prototype = {
        suspectListener: function (name) {
            this.suspect = Cluedo.suspects.filter(function (s) {
                return s.name.toLowerCase() == name.toLowerCase();
            })[0];
        },
        weaponListener: function (name) {
            this.weapon = Cluedo.weapons.filter(function (w) {
                return w.name.toLowerCase() == name.toLowerCase();
            })[0];
        },
        callInSuspect: function () {
            if (this.suspect.inRoom) {
                this.suspect.exitRoom(null);
            } else {
                Cluedo.board.squareAt(this.suspect.location).setOccupant(null);
                this.suspect.setLocation(null);
            }
            this.suspect.enterRoom(this.room);
        },
        questionPlayers: function () {

            var message = "No one could help you. Interesting..";
            this.player.hasAccusation=true;

            // players but the current
            var otherPlayers = Cluedo.players.filter(function (player) {
                return player != this.player
            }.bind(this));
            //
            //remember ask
            //
            var _memoizeAsk = _.memoize(function (player) {
                return player.ask(this.player, this);
            }.bind(this));

            var response = otherPlayers
                .filter(_memoizeAsk)
                .map(function (player,i) {
                    var card = _memoizeAsk(player);

                    return {
                        couldNotAnswer: otherPlayers.filter(function (p) {
                            return p != player;
                        }),
                        answerer: player,
                        card: card
                    }
                }.bind(this))[0];


            if (response && response.card) {
                this.player.hasAccusation=false;
                this.player.seeCard(this, response.card, response.answerer, response.couldNotAnswer);
                Cluedo.players.forEach(function (player) {
                    player.observeMove(this, this.player, response.answerer, response.couldNotAnswer);
                }.bind(this));
                //
                message = response.answerer.toString() + " can help you! => " + response.card.name;
            }else{
                console.log("hand =>"+this.player.hand.map(function(e){return e.name}));
            }
            console.log(message);

            return response && response.card
        }
    };
    module.exports = Suggestion;
});