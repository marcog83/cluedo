let bw = require("../bitwise/bw");
let Cards = require("../bitwise/Cards");
let compose = require("./compose");

function getRandomInt(min, max) {
    return ~~(Math.random() * (max - min + 1)) + min
}

var names = Object.entries(Cards).reduce((prev, [key, value]) => {
    prev[value] = key;
    return prev;
}, {});
module.exports = {
    NUM_CARDS: 24,
    getCard: (cards) => {
        let binary = compose(bw.binaryValues, bw.numToBinaryArray)(cards);
        let index = getRandomInt(0, binary.length - 1);


        return binary[index];
    }
    , fromNumberToName: (num) => {
        return names[num]
    }
};