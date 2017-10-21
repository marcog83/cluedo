let utils = require("../utils/utils");
let bw = require("../bitwise/bw");
let EventEmitter = require('events').EventEmitter;
class SearchSpace extends EventEmitter{
    constructor(suspects, weapons, rooms) {
        super();

        this.suspects = suspects;
        this.weapons = weapons;
        this.rooms = rooms;
        this.suspect = utils.getCard(this.suspects);
        this.weapon = utils.getCard(this.weapons);
        this.room = utils.getCard(this.rooms);
        //
    }

    excludeCard(card, emit) {
        let r = this.rooms,
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

            if (this.weapons === 0) {
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
            if (this.rooms === 0) {
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
            if (this.suspects === 0) {
                console.log(bw.numToBinaryArray(s));
                console.log(bw.numToBinaryArray(card));
                throw new Error(card);
            }

        }
        if (!emit) {
            this.emit("Changed",card);
        }
    }

    update(card) {
        this.excludeCard(card, true);
    }

    getPossibleCards() {
        return this.suspects | this.weapons | this.rooms;
    }

    getAccusation() {
        return this.suspect | this.weapon | this.room;
    }
}

module.exports = SearchSpace;