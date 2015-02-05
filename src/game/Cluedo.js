define(function (require, exports, module) {
    'use strict';

    var utils = require("../utils/utils");
    var Cards = require("../bitwise/Cards");
    var NUM_DECK_CARDS = 0;

    function Cluedo() {

        this.initWeapons();
        this.initSuspects();
        this.initRooms();
        this.newGame();
    }

    Cluedo.players = [];
    Cluedo.weapons = 0;
    Cluedo.suspects = 0;
    Cluedo.rooms = 0;
    Cluedo.solution = 0;

    Cluedo.finished = false;
    Cluedo.prototype = {
        initWeapons: function () {
            Cluedo.weapons = Cards.ROPE |
            Cards.CANDLESTICK |
            Cards.KNIFE |
            Cards.PISTOL |
            Cards.BAT |
            Cards.DUMBBELL |
            Cards.TROPHY |
            Cards.POISON |
            Cards.AXE;
        },
        initSuspects: function () {
            Cluedo.suspects = Cards.PLUM |
            Cards.SCARLETT |
            Cards.WHITE |
            Cards.GREEN |
            Cards.PEACOCK |
            Cards.MUSTARD;
        },
        initRooms: function () {
            Cluedo.rooms = Cards.SPA |
            Cards.THEATRE |
            Cards.LIVING |
            Cards.OBSERVATORY |
            Cards.PATIO |
            Cards.POOL |
            Cards.HALL |
            Cards.KITCHEN |
            Cards.DINING |
            Cards.GUEST;
        },
        newGame: function () {
            Cluedo.players = [];
            Cluedo.cards = Cluedo.weapons | Cluedo.suspects | Cluedo.rooms;
            Cluedo.rooms &= ~Cards.POOL;

        },
        prepareCards: function () {
            var leftR = ~~(Math.random() * 9);
            var leftS = ~~(Math.random() * 6) + 9;
            var leftW = ~~(Math.random() * 9) + 15;
            //
            var weapon = 1 << leftW;
            var suspect = 1 << leftS;
            var room = 1 << leftR;
            //
            var solution = weapon | suspect | room;
            //
            NUM_DECK_CARDS = utils.NUM_CARDS - 3;
            //
            var deck = (Cluedo.weapons | Cluedo.suspects | Cluedo.rooms);
            deck &= ~weapon;
            deck &= ~suspect;
            deck &= ~room;
            Cluedo.solution = solution;

            this.dealHands(deck);
        },
        dealHands: function (deck) {
            var numPlayers = Cluedo.players.length;
            var index = 0;
            do {
                var left = ~~(Math.random() * utils.NUM_CARDS);
                var card = 1 << left;
                if ((deck & card) == card) {
                    deck &= ~card;
                    //
                    var who = index % numPlayers;
                    Cluedo.players[who].hand |= card;
                    index++;
                }
                if (deck == 0) {
                    index = NUM_DECK_CARDS;
                }
            } while (index < NUM_DECK_CARDS);
            Cluedo.players.forEach(function (player) {
                player.setHand();
            });
        }
    };
    module.exports = Cluedo;
})
;