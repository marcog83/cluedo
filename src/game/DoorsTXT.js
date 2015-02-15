define(function (require, exports, module) {
    'use strict';
    var Cards = require("../bitwise/Cards");
    var Map = {
        S: Cards.STUDY,
        L: Cards.LOUNGE,
        H: Cards.HALL,
        I: Cards.LIBRARY,
        D: Cards.DINING,
        P: Cards.POOL,
        B: Cards.BILIARD,
        A: Cards.BALL,
        K: Cards.KITCHEN,
        C: Cards.CONSERVATORY
    };

    /**S STUDY
     * L LOUNGE
     * H HALL
     * I LIBRARY
     * D DINING ROOM
     * P POOL
     * B BILIARD ROOM
     * A BALL ROOM
     * K KITCHEN
     * C CONSERVATORY
     */

    var Doors = [
        "111111101111111101111111",
        "111111100111111001111111",
        "111111100111111001111111",
        "111111S00111111001111111",
        "100000000111111001111111",
        "00000000011111100L111111",
        "11111100011HH11000000001",
        "111111100000000000000000",
        "111111I00PPPPP0000000001",
        "111111100P111P001D111111",
        "111I11000P111P0011111111",
        "100000000P111P0011111111",
        "1B1111000P111P00D1111111",
        "111111000P111P0011111111",
        "111111000PPPPP0011111111",
        "11111B000000000000011111",
        "111111000000000000000001",
        "100000001A1111A100000000",
        "0000000011111111001K1111",
        "1111C000A111111A00111111",
        "111111001111111100111111",
        "111111001111111100111111",
        "111111001111111100111111",
        "111111100011110001111111",
        "111111111011110111111111"
    ].reduce(function (result, row, i) {
            row = row.split("");
            row.forEach(function (cell, j) {
                if (cell != "0" && cell != "1") {
                    var key = Map[cell];
                    result[key] = result[key] || [];
                    result[key].push({x: j, y: i});
                }
            });
            return result
        }, {});

    module.exports = Doors;
});