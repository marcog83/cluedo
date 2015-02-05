/**
 * Created by marco.gobbi on 05/02/2015.
 */
define(function (require) {
	"use strict";
	var bw = function () {
		var BYTES = 32;
		var prefix = function () {
			var prefix = "";
			for (var i = 1; i < BYTES; i++) {
				prefix += "0";
			}
			return prefix.split('');
		}();

		function numToBinaryArray(num, bytes_length) {
			bytes_length = bytes_length || BYTES;
			// js trick to correctly cast to string ~num
			var bin = (num >>> 0).toString(2);
			if (bin.length < BYTES) {
				bin = prefix.slice(0, BYTES - bin.length).join('') + bin;
			}
			bin = bin.substring(BYTES - bytes_length);
			return bin.split('').map(Number);
		}

		function binaryValues(binary) {
			return binary.map(function (value, index) {
				return {
					old: value,
					value: 1 << (binary.length - 1 - index),
					left: index
				}
			}).filter(function (item) {
				return item.old != 0
			}).map(function (item) {
				return item.value;
			})
		}

		return {
			numToBinaryArray: numToBinaryArray,
			contains: function (source, num) {
				var partial = ~~(source & ~num);
				return source & ~partial;
			},
			binaryForEach: function (num, callback) {
				_.compose(_.partialRight(_.forEach, callback), this.values)(num);
			},
			binaryValues: binaryValues,
			values: _.memoize(_.compose(binaryValues, numToBinaryArray))
		}
	}();
	return window.bw = bw;
})
;