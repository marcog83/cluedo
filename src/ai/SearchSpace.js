/**
 * Created by marco.gobbi on 02/02/2015.
 */
define(function (require) {
    "use strict";
    
    var utils = require("../utils/utils");
    var Signal = require("signals");

    function SearchSpace(suspects,weapons,rooms) {
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
            if (this.weapons & card) {
                this.weapons &= ~card;
                this.weapon = utils.getCard(this.weapons);
            }
            if (this.rooms & card) {
                this.rooms &= ~card;
                this.room = utils.getCard(this.rooms);
            }
            if (this.suspects & card) {
                this.suspects &= ~card;
                this.suspect = utils.getCard(this.suspects);
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