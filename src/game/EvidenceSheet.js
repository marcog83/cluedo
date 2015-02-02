define(function (require, exports, module) {
    'use strict';
    var Cluedo = require("./Cluedo");
    var Weapon = require("../card/Weapon");
    var Room = require("../card/Room");
    var Suspect = require("../card/Suspect");

    function EvidenceSheet() {
        this.weapons = Cluedo.weapons.slice(0);
        this.rooms = Cluedo.rooms.slice(0);
        this.suspects = Cluedo.suspects.slice(0);
    };
    EvidenceSheet.prototype = {
        seeCard: function (card) {
            if (card instanceof Weapon)
            //  this.weapons.remove(card);
                _.remove(this.weapons, card);
            if (card instanceof Room)
                _.remove(this.rooms, card);
            // this.rooms.remove(card);
            if (card instanceof Suspect)
                _.remove(this.suspects, card);
            // this.suspects.remove(card);
        }
    };
    module.exports = EvidenceSheet;
});