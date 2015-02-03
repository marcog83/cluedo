define(function (require, exports, module) {
    'use strict';
    function Weapon(name) {
        this.name = name;
        this.type = "Weapon";
    }

    Weapon.prototype = {
        toString: function () {
            return this.name;
        },

    };

    Weapon.ROPE = new Weapon("Rope");
    Weapon.CANDLESTICK = new Weapon("Candlestick");
    Weapon.KNIFE = new Weapon("Knife");
    Weapon.PISTOL = new Weapon("Pistol");
    Weapon.BAT = new Weapon("Bat");
    Weapon.DUMBBELL = new Weapon("Dumbbell");
    Weapon.TROPHY = new Weapon("Trophy");
    Weapon.POISON = new Weapon("Poison");
    Weapon.AXE = new Weapon("Axe");
    module.exports = Weapon;
});