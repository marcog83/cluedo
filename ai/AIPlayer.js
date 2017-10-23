let SearchSpace = require("./SearchSpace");

let PlayerAssumption = require("./PlayerAssumption");
//
let Cluedo = require("../game/Cluedo");
let Cards = require("../bitwise/Cards");
let bw = require("../bitwise/bw");
let {fromNumberToName} = require("../utils/utils");

class AIPlayer {
    constructor() {
        this.shownCards = {};
        this.assumptions = {};
        this.hand = 0;
        this.searchSpace = new SearchSpace(Cluedo.suspects, Cluedo.weapons, Cluedo.rooms);
        this.player = undefined;
    }

    setHand() {
        this.assumptions = [];
        let otherPlayers = Cluedo.players.filter(player => player !== this.player);
        //

        otherPlayers.forEach((player) => {
            let a = new PlayerAssumption(player, Cluedo.cards);

            this.assumptions.push(a);
            let tmpHM = {};
            bw.binaryForEach(this.hand, function (value) {
                tmpHM[value] = false;
            });
            this.shownCards[player] = tmpHM;
        });
        //
        bw.binaryForEach(this.hand, card => {
            this.searchSpace.update(card);
            this.assumptions.forEach(assumption => {
                assumption.update(card);
            });
        });
        this.assumptions.forEach((assumption) => {
            assumption.on("CertainAdded", this.observeAssumption.bind(this));
        });
        this.searchSpace.on("Changed", card => {
            this.assumptions.forEach(function (assumption) {
                assumption.update(card);
            });
        });
        /**/
    }

    observeAssumption(card, _, cAssumption) {
        if (this.player.hasAccusation) return;
        this.searchSpace.update(card);
        this.assumptions.forEach(function (assumption) {
            if (assumption !== cAssumption) {
                assumption.update(card);
            }
        });
    }

    ask(questionair, {suspect,weapon,room}) {
        this.shownCards[questionair] = this.shownCards[questionair] || {};
        let card = null;
        if (this.hand & suspect) {
            this.shownCards[questionair][suspect] = true;
            card = suspect;
        }
        if (this.hand & weapon) {
            this.shownCards[questionair][weapon] = true;
            card = weapon;
        }
        if (this.hand & room) {
            this.shownCards[questionair][room] = true;
            card = room;
        }
        return card;
    }

    seeCard(suggestion, card, answerer, _couldNotAnswer) {
        this.couldNotAnswer(suggestion, _couldNotAnswer);
        let pa = this.getPlayerAssumption(answerer);
        pa.addCertainHandCard(card);
    }

    couldNotAnswer({suspect,weapon,room}, couldNotAnswer) {
        couldNotAnswer
            .filter(player => player !== this.player)
            .forEach(player => {
                let pa = this.getPlayerAssumption(player);
                pa.removePossibleCard(suspect);
                pa.removePossibleCard(room);
                pa.removePossibleCard(weapon);
            });
    }

    getPlayerAssumption(player) {
        return this.assumptions.filter(pa => pa.player === player)[0];
    }

    suggest(player) {
        let suggestion = {
            suspect: this.searchSpace.suspect,
            weapon: this.searchSpace.weapon,
            room: this.searchSpace.room,
            player: player
        };
        let ranks = this.getRanks();
        let r = 21;
        let bestRanks = {
            weapon: r,
            suspect: r,
            room: r
        };
        console.log("what about...", [
            fromNumberToName(suggestion.suspect),
            fromNumberToName(suggestion.weapon),
            fromNumberToName(suggestion.room)
        ]);
        Object.keys(ranks).forEach(key => {
            let item = ranks[key];
            if (item.rank < bestRanks[item.type]) {
                console.log("think... this %s is better ->", item.type, fromNumberToName(key));
                suggestion[item.type] = parseInt(key);
                this.searchSpace[item.type] = parseInt(key);
                bestRanks[item.type] = item.rank;
            }
        });


        console.log(player.toString(), "=>", [
            fromNumberToName(suggestion.suspect),
            fromNumberToName(suggestion.weapon),
            fromNumberToName(suggestion.room)
        ]);

        return Promise.resolve(suggestion);
    }

    getRanks() {


        function _map(num, type) {
            return bw.filter(num).reduce((result, item) => {
                result[item.value] = {
                    rank: 1,
                    type: type
                };
                return result;
            }, {});
        }

        let weapons = _map(this.searchSpace.weapons, 'weapon');
        let suspects = _map(this.searchSpace.suspects, 'suspect');
        let rooms = _map(this.searchSpace.rooms, 'room');

        let ranks = Object.assign(weapons, suspects, rooms);


        //
        let inc = this.assumptions.length + 1;
        const length = this.assumptions.length;

        for (let i = 0; i < length; i++) {
            let assumption = this.assumptions[i];
            let cnf = assumption.kb;
            let nClauses = cnf.clauses.length;

            let literals = cnf.getAllLiterals();

            literals.forEach((entry, card) => {
                if (ranks[card]) {
                    (ranks[card].rank += (inc * entry / nClauses));
                }

            });

            bw.binaryForEach(assumption.possibleHandCards, (card) => {
                ranks[card].rank += inc;
            });

            inc--;
        }


        return ranks;

    }

    /**
     * This method is called when a player show another player a card hidden from
     * this player.
     *
     * @param suggestion subjected suggestion
     * @param questionair asking player
     * @param answerer answering player
     * @param couldNotAnswer set of players which could not answer

     */
    observeMove(suggestion, questionair, answerer, couldNotAnswer) {
        this.couldNotAnswer(suggestion, couldNotAnswer);
        if (!answerer || this.player === answerer) { // Not interesting
            return;
        }
        let pa = this.getPlayerAssumption(answerer);
        pa.addAnsweredSuggestion(suggestion);
    }

    stayOrLeave(player) {
        //TODO come automatizzare scelta!!!
        let _desiredRoom = this.searchSpace.room;
        if (player.hasAccusation) {
            console.log(player.toString(), "=> I Know who the Murderer is!");
            _desiredRoom = Cards.POOL;
        }

        if (player.room === _desiredRoom) {
            return Promise.resolve(true);
        } else {
            return Promise.reject(_desiredRoom);
        }
    }

    get desiredRoom() {
        let _desiredRoom = this.searchSpace.room;
        if (this.player.hasAccusation) {
            console.log(this.player.toString(), "=> I Know who the Murderer is!");
            _desiredRoom = Cards.POOL;
        }
        return _desiredRoom;
    }

    setAccusation() {
        let accusation = this.searchSpace.getAccusation();
        console.log(this.player.toString(), "=> I accuse:", accusation);
        return Promise.resolve(accusation);
    }

    getFormattedAccusation() {
        return {
            suspect: this.searchSpace.suspect,
            weapon: this.searchSpace.weapon,
            room: this.searchSpace.room
        }
    }
}


module.exports = AIPlayer;