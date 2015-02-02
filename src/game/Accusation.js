define(function (require, exports, module) {
    'use strict';
    var Cluedo = require("./Cluedo");

    function Accusation(player) {
        this.player = player;
        this.accusation = [];
        this.murderer;
        this.murderWeapon;
        this.murderRoom;
        this.accusation.push(this.murderer);
        this.accusation.push(this.murderWeapon);
        this.accusation.push(this.murderRoom);
        this.checkAccusation();
    }

    Accusation.prototype = {
        checkRemainingPlayers: function () {
            var remaining = 0;
            var winner = null;
            for (var player in Cluedo.players)
                if (player.inGame()) {
                    remaining++;
                    winner = player;
                }
            if (remaining == 1) {
                alert("Win by default Only " + winner + " remains!");
                Cluedo.finished = true;
            }
        },
        checkAccusation: function(){
        if(Cluedo.solution.containsAll(this.accusation)){
            alert(this.player+" wins! You're right!");

            Cluedo.finished=true;
        }else{
            alert("Go sit in the corner\nand feel ashamed. You're WRONG.");
            this.player.eliminate();
            this.checkRemainingPlayers();
        }
    }
    };
    module.exports = Accusation;
});