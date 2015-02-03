define(function (require, exports, module) {
	'use strict';
	var Cluedo = require("./Cluedo");


	function EvidenceSheet() {
		this.weapons = Cluedo.weapons.slice(0);
		this.rooms = Cluedo.rooms.slice(0);
		this.suspects = Cluedo.suspects.slice(0);
	};
	EvidenceSheet.prototype = {
		seeCard: function (card) {
			if (card.type=='Weapon' ) {
				_.remove(this.weapons, card);
			}
			if (card.type=='Room') {
				_.remove(this.rooms, card);
			}

			if (card.type=='Suspect') {
				_.remove(this.suspects, card);
			}

		}
	};
	module.exports = EvidenceSheet;
});