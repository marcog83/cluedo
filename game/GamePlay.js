let bw = require("../bitwise/bw");
let Cluedo = require("./Cluedo");
let Dice = require("./Dice");

let Suggestion = require("./Suggestion");

let Cards = require("../bitwise/Cards");
let {fromNumberToName} = require("../utils/utils");
let EventEmitter = require('events').EventEmitter;
//
let MAX_TURN = 20 * 3;
let current = 0;

function isNumber(value) {
    return !isNaN(value - parseFloat(value));
}

class GamePlay extends EventEmitter {
    constructor() {

        super();
        Cluedo.players = [];
        Cluedo.finished = false;
    }

    start() {
        MAX_TURN = 20 * Cluedo.players.length;
        current = 0;
        Cluedo.prepareCards();

        this.takeTurn(Cluedo.players[0]);
    }

    enter(room) {
        console.log("enter", fromNumberToName(room));
        if (room !== Cards.POOL) {
            this.currentPlayer.suggest()
                .then(Suggestion.questionPlayers)
                .then(this.endTurn.bind(this));
        }
        else {
            console.log(this.currentPlayer.toString(), "=> Follow Me here at the pool!");
            this.currentPlayer.setAccusation()
                .then(this.checkAccusation.bind(this))
                .then(this.endTurn.bind(this));
        }
        this.emit("PlayerEntered")
        // this.onPlayerEntered.emit();


    }

    checkAccusation(accusation) {
        let correct = Cluedo.solution === accusation;
        console.log("Let me see!!! It's", correct);
        if (correct) {
            this.emit("Win", this.currentPlayer, this.currentPlayer.getFormattedAccusation(), Cluedo.solution);
            // this.onWin.emit(this.currentPlayer, this.currentPlayer.getFormattedAccusation(), Cluedo.solution);
            Cluedo.finished = true;
        } else {
            this.currentPlayer.eliminate();
            this.emit("Failed", this.currentPlayer, accusation, Cluedo.solution);
            //   this.onFailed.emit(this.currentPlayer, accusation, Cluedo.solution);
            this.checkRemainingPlayers();
        }
        return correct;
    }

    checkRemainingPlayers() {
        let remaining = Cluedo.players.filter(player => player.inGame);
        if (remaining.length === 1) {
            this.emit("Win", remaining[0]);
            // this.onWin.emit(remaining[0]);
            Cluedo.finished = true;
        }
    }

    takeTurn(player) {
        console.log(parseInt(current / Cluedo.players.length), "-------------------- " + player.toString() + " --------------------------------");
        this.currentPlayer = player;
        if (player.inRoom) {
            console.log("in room");
            // confirm dialog
            player.stayOrLeave()
                .then(player.suggest.bind(player))
                .then(Suggestion.questionPlayers)
                .then(this.endTurn.bind(this))
                .catch(desiredRoom => {
                    this._roll();
                    this.leave();
                    if (isNumber(desiredRoom)) {
                        this.enter(desiredRoom);
                    } else {
                        throw desiredRoom;
                    }
                });
        } else {
            console.log("not in room");
            this.enter(player.desiredRoom);
            // this._roll(player);
        }
    }

    leave() {
        //let room = this.currentPlayer.character.room;
        //
        // this.currentPlayer.character.exitRoom(room.exits[0]);
        this.roll--; //uses one step.
        this.emit("Leave", this.selection, this.roll);
        //  this.onLeave.emit(this.selection, this.roll);
    }

    _roll() {
        this.roll = Dice.roll();
        this.emit("Roll", this.roll);
        // this.onRoll.emit(this.roll);
    }

    endTurn(result) {
        this.roll = 0;
        if (typeof(result) !== "boolean") {
            // this.onTurnCompleted.emit(result);
            this.emit("TurnCompleted", result);
        }

    }

    nextPlayer() {
        if (Cluedo.finished || current > MAX_TURN) {
            if (current > MAX_TURN) {
                Cluedo.players.filter(player => player.inGame)
                    .forEach((p, i) => {
                        console.log(i, bw.numToBinaryArray(p.controller.searchSpace.getAccusation()));
                    });
                console.log("solution:", bw.numToBinaryArray(Cluedo.solution));
            }

            return;
        }
        current++;

        let inGamePlayers = Cluedo.players.filter(player => player.inGame);
        let index = current % inGamePlayers.length;

        this.takeTurn(inGamePlayers[index]);
    }
}


module.exports = GamePlay;