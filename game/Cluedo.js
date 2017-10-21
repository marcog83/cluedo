let {
    // rooms
    POOL,
    STUDY,
    LOUNGE,
    HALL,
    LIBRARY,
    DINING,
    BILIARD,
    BALL,
    KITCHEN,
    CONSERVATORY,
    // suspects
    PLUM,
    SCARLETT,
    WHITE,
    GREEN,
    PEACOCK,
    MUSTARD,
    // weapons
    ROPE,
    CANDLESTICK,
    KNIFE,
    PISTOL,
    BAT,
    DUMBBELL,
    TROPHY,
    POISON,
    AXE

} = require("../bitwise/Cards");
let NUM_CARDS = 24,
    NUM_DECK_CARDS = NUM_CARDS - 3,
    weapons = ROPE | CANDLESTICK | KNIFE | PISTOL | BAT | DUMBBELL | TROPHY | POISON | AXE,
    suspects = PLUM | SCARLETT | WHITE | GREEN | PEACOCK | MUSTARD,
    rooms = BALL | BILIARD | DINING | CONSERVATORY | HALL | POOL | KITCHEN | LIBRARY | LOUNGE | STUDY,
    cards = weapons | suspects | rooms;


 function dealHands(deck) {
    let numPlayers = Cluedo.players.length;
    let index = 0;
    do {
        let left = ~~(Math.random() * NUM_CARDS);
        let card = 1 << left;
        if ((deck & card) === card) {
            deck &= ~card;
            //
            let who = index % numPlayers;
            Cluedo.players[who].hand |= card;
            index++;
        }
        if (deck === 0) {
            index = NUM_DECK_CARDS;
        }
    } while (index < NUM_DECK_CARDS);
    Cluedo.players.forEach(player => player.setHand());
}

const Cluedo = {
    players: [],
    weapons,
    suspects,
    rooms,
    cards,
    solution: 0,
    finished: false,
    prepareCards: () => {
        let leftRooms = ~~(Math.random() * 9);
        let leftSuspects = ~~(Math.random() * 6) + 9;
        let leftWeapons = ~~(Math.random() * 9) + 15;
        //
        let weapon = 1 << leftWeapons;
        let suspect = 1 << leftSuspects;
        let room = 1 << leftRooms;
        //
        let solution = weapon | suspect | room;
        //
        let deck = (weapons | suspects | rooms);
        deck &= ~weapon;
        deck &= ~suspect;
        deck &= ~room;
        Cluedo.solution = solution;

        dealHands(deck);
    }

};
module.exports = Cluedo;