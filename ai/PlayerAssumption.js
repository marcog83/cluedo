let CNF = require("./CNF");
let Clause = require("./Clause");
let bw = require("../bitwise/bw");
let compact = require("../utils/compact");
let {fromNumberToName} = require("../utils/utils");
let EventEmitter = require('events').EventEmitter;
class PlayerAssumption extends EventEmitter{
    constructor(player, cards) {
        super();
        this.player = player;

        this.possibleHandCards = cards;
        this.certainHandCards = 0;
        this.kb = new CNF();

    }
    removePossibleCard (card, emit) {
        if (!(this.possibleHandCards & card)
            || (this.certainHandCards & card)) {
            return; // Already added / not possible
        }
        //elimina la card
        this.possibleHandCards &= ~card;
        ////
        this.kb.addNewFact(card, false);
        let facts = this.kb.getNewFacts();
        let alreadyAddedFacts = [];
        while (facts.length) {
            let l = facts.shift();
            if (l.sign && (alreadyAddedFacts.indexOf(l) === -1)) {
                // we have found new certain hand card
                this.addCertainHandCard(l.value);
                alreadyAddedFacts.push(l);
                facts =this.kb.getNewFacts();
            }
        }
    }
    addCertainHandCard (card) {
        this.certainHandCards |= card;
        this.possibleHandCards &= ~card;
        this.notifyObservers(card);
        let _hand = compact(bw.numToBinaryArray(this.player.hand)).length;
        let _certainHandCards = compact(bw.numToBinaryArray(this.certainHandCards)).length;
        if (_hand === _certainHandCards) {
            this.possibleHandCards = 0;
            //
        }
        this.kb.addNewFact(card, true);
    }
    /**
     * This method is called whenever a certain card is added somewhere else.
     * We can then exclude this card from our possible cards pool.
     *
     */
    update (card) {
        this.removePossibleCard(card, true);
    }
    notifyObservers (card, emit) {
        if (!emit) {
            console.log("CertainAdded",fromNumberToName(card))
            this.emit("CertainAdded",card, false, this);
        }
    }
    /**
     * Call this method when the subjected player answered a suggestion hidden
     * from the AI player. It will add a suitable clause to the knowledge base
     * if none of the cards in the suggestion are in the certain hand cards.
     *
     * @param suggestion suggestion to add

     */
    addAnsweredSuggestion ({suspect,room,weapon}) {
        let clause = new Clause();
        let cards = suspect | room | weapon;

        if (!(cards & this.certainHandCards)) {
            // let binary = utils.numToBinaryArray(cards);
            if (this.possibleHandCards & suspect) {
                clause.addLiteral(suspect, true);
            }
            if (this.possibleHandCards & room) {
                clause.addLiteral(room, true);
            }
            if (this.possibleHandCards & weapon) {
                clause.addLiteral(weapon, true);
            }
            if (clause.literals.length === 1) { // New certain hand card
                this.addCertainHandCard(clause.literals[0].value);
            } else if (!clause.isEmpty()) { // New clause
                this.kb.addClause(clause);
            }
        }
    }
}
 
module.exports= PlayerAssumption;