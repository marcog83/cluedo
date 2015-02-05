define(function (require, exports, module) {
	'use strict';
	var bw = require("../bitwise/bw");
	module.exports =  {
		NUM_CARDS: 24,
		getCard: function (cards) {
			var binary = bw.numToBinaryArray(cards, this.NUM_CARDS);
			var index = binary.indexOf(1);
			var value = 1 << (binary.length - 1 - index);
			if (!value) {
				throw new Error("WHY NOT?");
			}
			return value;
		}
	};
})
;