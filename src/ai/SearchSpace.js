/**
 * Created by marco.gobbi on 02/02/2015.
 */// Help Node out by setting up define.
if (typeof exports === 'object' && typeof define !== 'function') {
    var define = function (factory) {
        factory(require, exports, module);
    };
}
define(function (require, exports, module) {
    "use strict";
    var utils = require("../utils/utils");
    var bw = require("../bitwise/bw");
    var Signal = require("js-signal-slot");

    function power_of_2(number) {
        return number != 0 && number & (number - 1) == 0
    }

    function SearchSpace(suspects, weapons, rooms) {
        this.onChanged = new Signal();
        this.suspects = suspects;
        this.weapons = weapons;
        this.rooms = rooms;
        this.suspect = utils.getCard(this.suspects);
        this.weapon = utils.getCard(this.weapons);
        this.room = utils.getCard(this.rooms);
        //
    }

    SearchSpace.prototype = {
        excludeCard: function (card, emit) {
            var r = this.rooms,
                w = this.weapons,
                s = this.suspects;
            //
            if (this.weapons & card) {
                if (this.weapons & ~card) {
                    this.weapons &= ~card;
                    this.weapon = utils.getCard(this.weapons);
                } else {
                    this.weapon = card;
                }

                if (this.weapons == 0 && !power_of_2(this.weapon)) {
                    throw new Error(card);
                }

            }
            if (this.rooms & card) {

                if (this.rooms & ~card) {
                    this.rooms &= ~card;
                    this.room = utils.getCard(this.rooms);
                } else {
                    this.room = card;
                }
                if (this.rooms == 0 && !power_of_2(this.room)) {
                    throw new Error(card);
                }

            }
            if (this.suspects & card) {

                if (this.suspects & ~card) {
                    this.suspects &= ~card;
                    this.suspect = utils.getCard(this.suspects);
                } else {
                    this.suspect = card;
                }
                if (this.suspects == 0 && !power_of_2(this.suspect)) {
                    throw new Error(card);
                }

            }

            if (!emit) {
                this.onChanged.emit(card);
            }
        },
        update: function (card) {
            this.excludeCard(card, true);
        },
        getPossibleCards: function () {
            return this.suspects | this.weapons | this.rooms;
        },
        getAccusation: function () {
            return this.suspect | this.weapon | this.room;
        }
    };
    module.exports = SearchSpace;
});