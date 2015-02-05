/**
 * Created by marco.gobbi on 02/02/2015.
 */
define(function (require) {
    "use strict";
    var utils = require("../utils/utils");
    var bw = require("../bitwise/bw");
    var Signal = require("signals");

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

                if (this.weapons == 0) {
                    console.log(bw.numToBinaryArray(w));
                    console.log(bw.numToBinaryArray(card));
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
                if (this.rooms == 0) {
                    console.log(bw.numToBinaryArray(r));
                    console.log(bw.numToBinaryArray(card));
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
                if (this.suspects == 0) {
                    console.log(bw.numToBinaryArray(s));
                    console.log(bw.numToBinaryArray(card));
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
    return SearchSpace;
});