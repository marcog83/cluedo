define(function (require, exports, module) {
	'use strict';
	var NUM_CARDS = 24;
	module.exports = {
		NUM_CARDS: NUM_CARDS,
		numToBinaryArray: function (num) {
			var bin = num.toString(2);
			if (bin.length < NUM_CARDS) {
				bin = '00000000000000000000000'.split('').slice(0, NUM_CARDS - bin.length).join('') + bin;
			}
			return bin.split('').map(Number);
		},
		get: function (source, num) {
			return source & (1 << num);
		},
		set: function (source, num) {
			return source | 1 << num;
		},
		remove: function (source, num) {
			return source & ~(1 << num);
		},
		getCard: function (cards) {
			var binary = this.numToBinaryArray(cards);
			var value = 0;
			var i = 0;
			while (value == 0 && i < binary.length) {
				value = binary[i];
				if (value != 0) {
					value = 1 << i;
				}
				i++;
			}
			return value;
		}
	};
})
;