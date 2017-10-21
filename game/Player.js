var Cluedo = require("./Cluedo");


class Player {
    constructor({id, controller, movement}) {
        this.character = id;

        this.controller = controller;
        this.controller.player = this;
        this.movement = movement;
        this.inGame = true;
    }

    gotoRoom(room) {
        return this.movement.gotoRoom(room);
    }

    get location() {
        return this.movement.location;
    }

    get room() {
        return this.movement.room;
    }

    get inRoom() {
        return this.movement.inRoom
    }

    get desiredRoom() {
        return this.controller.desiredRoom
    }

    setHand(hand) {
        this.controller.setHand(hand);
    }

    stayOrLeave() {
        return this.controller.stayOrLeave(this);
    }

    suggest() {
        return this.controller.suggest(this);
    }

    ask(questionair, suggestion) {
        return this.controller.ask(questionair, suggestion);
    }

    eliminate() {
        this.inGame = false;
    }

    seeCard(suggestion, card, asked, couldNotAnswer) {
        return this.controller.seeCard(suggestion, card, asked, couldNotAnswer, this);
    }

    observeMove(suggestion, questionair, answerer, couldNotAnswer) {
        return this.controller.observeMove(suggestion, questionair, answerer, couldNotAnswer);
    }

    toString() {
        return "Player " + (Cluedo.players.indexOf(this) + 1);
    }

    get hand() {
        return this.controller.hand;
    }

    set hand(value) {
        return this.controller.hand = value;
    }

    setAccusation() {
        return this.controller.setAccusation();
    }

    getFormattedAccusation() {
        return this.controller.getFormattedAccusation();
    }
}


module.exports = Player;