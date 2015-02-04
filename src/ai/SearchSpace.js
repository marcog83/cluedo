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
		this.suspects = Cluedo.suspects;
		this.weapons = Cluedo.weapons;
		this.rooms = Cluedo.rooms;
		this.solPerson = utils.getCard(this.suspects);
		this.solWeapon = utils.getCard(this.weapons);
		this.solRoom = utils.getCard(this.rooms);
		//
	}

	SearchSpace.prototype = {
		excludeCard: function (card, emit) {
			if (this.weapons & card) {
				this.weapons = this.weapons ^ card;
				this.solWeapon = utils.getCard(this.weapons);
			}
			if (this.rooms & card) {
				this.rooms = this.rooms ^ card;
				this.solRoom = utils.getCard(this.rooms);
			}
			if (this.suspects & card) {
				this.suspects = this.suspects ^ card;
				this.solPerson = utils.getCard(this.suspects);
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
			return this.solPerson | this.solWeapon | this.solRoom;
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