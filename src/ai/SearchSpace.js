/**
 * Created by marco.gobbi on 02/02/2015.
 */
define(function (require) {
    "use strict";
    var Cluedo = require("../game/Cluedo");
    var Room = require("../card/Room");
    var utils = require("../utils/utils");
    var Signal = require("signals");

    function SearchSpace() {
        this.onChanged = new Signal();
        this.suspects = Cluedo.suspects.slice(0);
        this.weapons = Cluedo.weapons.slice(0);
        this.rooms = Cluedo.rooms.slice(0);
        _.remove(this.rooms, Room.POOL);

        this.solPerson = this.suspects[0];

        this.solWeapon = this.weapons[0];

        this.solRoom = this.rooms[0];
        //
    }

    SearchSpace.prototype = {
        excludeCard: function (card) {

            if (card.type == 'Weapon') {
                _.remove(this.weapons, card);
                this.solWeapon = _.last(this.weapons);
            }
            if (card.type == 'Room') {
                _.remove(this.rooms, card);
                this.solRoom = _.last(this.rooms);
            }
            if (card.type == 'Suspect') {
                _.remove(this.suspects, card);
                this.solPerson = _.last(this.suspects);
            }
            this.onChanged.emit(card);

        },
        update: function (card) {
            this.excludeCard(card);
        },
        getPossibleCards: function () {
            return this.suspects.concat(this.weapons, this.rooms);
        },
        getAccusation: function () {
            return [
                this.solPerson,
                this.solWeapon,
                this.solRoom
            ];
        },
        getSolutionPerson: function () {
            return this.solPerson;
        },
        getSolutionWeapon: function () {
            return this.solWeapon;
        },
        getSolutionRoom: function () {
            return this.solRoom;
        }
    };
    return SearchSpace;
});