const memoize = require("../utils/memoize");
const compose = require("../utils/compose");
let BYTES = 32;


let prefix = function () {
    let _prefix = "";
    for (let i = 1; i < BYTES; i++) {
        _prefix += "0";
    }
    return _prefix.split('');
}();

function numToBinaryArray(num, bytes_length) {
    bytes_length = bytes_length || BYTES;
    // js trick to correctly cast to string ~num
    let bin = (num >>> 0).toString(2);
    if (bin.length < BYTES) {
        bin = prefix.slice(0, BYTES - bin.length).join('') + bin;
    }
    bin = bin.substring(8);
    return bin.split('').map(Number);
}

function filter(binary) {
    return binary.map(function (value, index) {
        return {
            old: value,
            value: 1 << (binary.length - 1 - index),
            left: index
        }
    }).filter(function (item) {
        return item.old !== 0
    })
}

function binaryValues(binary) {
    return filter(binary).map(function (item) {
        return item.value;
    })
}

const values = memoize(compose(binaryValues, numToBinaryArray));
module.exports = {
    filter: memoize(compose(filter, numToBinaryArray)),
    numToBinaryArray,
    contains: (source, num) => {
        let partial = ~~(source & ~num);
        return source & ~partial;
    },
    binaryForEach: (num, callback) => {
        values(num).forEach(callback);
        //   compose(_.partialRight(_.forEach, callback), this.values)(num);
    },
    binaryValues,
    values
};