define(function (require, exports, module) {
    'use strict';
    var Cards = require("../../bitwise/Cards");
    var CardsMap = {};
    CardsMap[Cards.AXE] = {
        label: "axe",
        id: Cards.AXE
    };
    CardsMap[Cards.BAT] = {
        label: "bat",
        id: Cards.BAT
    };
    CardsMap[Cards.CANDLESTICK] = {
        label: "candle stick",
        id: Cards.CANDLESTICK
    };
    CardsMap[Cards.DINING] = {
        label: "Dining room",
        id: Cards.DINING
    };
    CardsMap[Cards.DUMBBELL] = {
        label: "Dumb bell",
        id: Cards.DUMBBELL
    };
    CardsMap[Cards.GREEN] = {
        label: "Green",
        id: Cards.GREEN,
        location:{x:7,y:0}
    };
    CardsMap[Cards.STUDY] = {
        label: "Study",
        id: Cards.STUDY
    };
    CardsMap[Cards.HALL] = {
        label: "Hall",
        id: Cards.HALL
    };
    CardsMap[Cards.KITCHEN] = {
        label: "Kitchen",
        id: Cards.KITCHEN
    };
    CardsMap[Cards.KNIFE] = {
        label: "Knife",
        id: Cards.KNIFE
    };
    CardsMap[Cards.LOUNGE] = {
        label: "Lounge",
        id: Cards.LOUNGE
    };
    CardsMap[Cards.MUSTARD] = {
        label: "Mustard",
        id: Cards.MUSTARD,
        location:{x:16,y:0}
    };
    CardsMap[Cards.CONSERVATORY] = {
        label: "Conservatory",
        id: Cards.CONSERVATORY
    };
    CardsMap[Cards.LIBRARY] = {
        label: "Library",
        id: Cards.LIBRARY
    };
    CardsMap[Cards.PEACOCK] = {
        label: "Peacock",
        id: Cards.PEACOCK,
        location:{x:23,y:7}
    };
    CardsMap[Cards.PISTOL] = {
        label: "Pistol",
        id: Cards.PISTOL
    };
    CardsMap[Cards.PLUM] = {
        label: "Plum",
        id: Cards.PLUM,
        location:{x:0,y:5}
    };
    CardsMap[Cards.POISON] = {
        label: "Poison",
        id: Cards.POISON
    };
    CardsMap[Cards.POOL] = {
        label: "Pool",
        id: Cards.POOL
    };
    CardsMap[Cards.ROPE] = {
        label: "Rope",
        id: Cards.ROPE
    };
    CardsMap[Cards.SCARLETT] = {
        label: "Scarlett",
        id: Cards.SCARLETT,
        location:{x:0,y:18}
    };
    CardsMap[Cards.BALL] = {
        label: "Ballroom",
        id: Cards.BALL
    };
    CardsMap[Cards.BILIARD] = {
        label: "Biliard",
        id: Cards.BILIARD
    };
    CardsMap[Cards.TROPHY] = {
        label: "Trophy",
        id: Cards.TROPHY
    };
    CardsMap[Cards.WHITE] = {
        label: "White",
        id: Cards.WHITE,
        location:{x:9,y:24}
    };
    module.exports = CardsMap;
});