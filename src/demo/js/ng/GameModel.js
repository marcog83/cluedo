define(function (require, exports, module) {
    'use strict';
    var Cards = require("../../../bitwise/Cards");
    var CardsMap = require("../CharacterMap");

    function GameModel() {
        this.players = [];
        this.characters = [
            {
                id: Cards.PLUM,
                name: "Plum"
            }, {
                id: Cards.SCARLETT,
                name: "Scarlet"
            }, {
                id: Cards.WHITE,
                name: "White"
            }, {
                id: Cards.GREEN,
                name: "Green"
            }, {
                id: Cards.PEACOCK,
                name: "Peacock"
            }, {
                id: Cards.MUSTARD,
                name: "Mustard"
            }
        ]
    }

    GameModel.prototype = {
        addNewPlayer: function (character) {
            if (this.maxPlayers)return;
            this.players.push({
                name: "",
                ai: true,
                character: character || 0
            })
        },
        setWinRecap:function(player,accusation){
            this.lastTurn={
                winner:true,
                player:CardsMap[player.character].label,
                suspect: CardsMap[accusation.suspect].label,
                room: CardsMap[accusation.room].label,
                weapon: CardsMap[accusation.weapon].label,
                answerer:"",
                card:""
            }
        },
        setLastTurn: function (results) {
            if (typeof(results) == "boolean") {
                return;
            }
            this.lastTurn = {
                winner:  results.winner,
                player:CardsMap[results.suggestion.player.character].label,
                room:CardsMap[results.suggestion.room].label,
                suspect:CardsMap[results.suggestion.suspect].label,
                weapon:CardsMap[results.suggestion.weapon].label,
                card:results.card ? CardsMap[results.card].label : "Nessuno ha risposto!",
                answerer:results.card ? CardsMap[results.answerer.character].label : ""
            };


        },
        get maxPlayers() {
            return this.players.length >= 6;
        },
        get minPlayers() {
            return this.players.length > 1;
        }
    };
    module.exports = GameModel;
});