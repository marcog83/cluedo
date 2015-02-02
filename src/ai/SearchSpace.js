/**
 * Created by marco.gobbi on 02/02/2015.
 */
define(function (require) {
	"use strict";
	var Cluedo = require("../game/Cluedo");
	var Weapon = require("../card/Weapon");
	var Room = require("../card/Room");
	var Suspect = require("../card/Suspect");

	function SearchSpace() {
		this.possiblePersons = {};
		this.possibleWeapons = {};
		this.possibleRooms = {};
		this.solPerson = null;
		this.solWeapon = null;
		this.solRoom = null;
		//
		Cluedo.cards.forEach(function (card) {
			if (card instanceof Weapon) {
				this.possibleWeapons.push(card);
			}
			if (card instanceof Room) {
				this.possibleRooms.push(card);
			}
			if (card instanceof Suspect) {
				this.possiblePersons.push(card);
			}
		});
	}

	SearchSpace.prototype = {
		excludeCard: function (card) {
			if (card instanceof Weapon) {
				_.remove(this.possibleWeapons, card);
				this.solWeapon = _.last(this.possibleWeapons);
			}
			if (card instanceof Room) {
				_.remove(this.possibleRooms, card);
				this.solRoom = _.last(this.possibleRooms);
			}
			if (card instanceof Suspect) {
				_.remove(this.possiblePersons, card);
				this.solPerson = _.last(this.possiblePersons);
			}
		},
		update: function (card) {
			this.excludeCard(card);
		},
		getPossibleCards: function () {
			return this.possiblePersons.concat(this.possibleWeapons, this.possibleRooms);
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