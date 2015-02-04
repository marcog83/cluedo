/**
 * Created by marco.gobbi on 04/02/2015.
 */
define(function (require) {
	"use strict";
	return {
		// rooms
		POOL: 0,
		THEATRE: 1 << 0,
		LIVING: 1 << 1,
		OBSERVATORY: 1 << 2,
		PATIO: 1 << 3,
		SPA: 1 << 4,
		HALL: 1 << 5,
		KITCHEN: 1 << 6,
		DINING: 1 << 7,
		GUEST: 1 << 8,
		// suspects
		PLUM:1 << 9,
		SCARLETT:1 << 10,
		WHITE:1 << 11,
		GREEN:1 << 12,
		PEACOCK:1 << 13,
		MUSTARD:1 << 14,
		// weapons
		ROPE:1 << 15,
		CANDLESTICK:1 << 16,
		KNIFE:1 << 17,
		PISTOL:1 << 18,
		BAT:1 << 19,
		DUMBBELL:1 << 20,
		TROPHY:1 << 21,
		POISON:1 << 22,
		AXE:1 << 23

	};
});