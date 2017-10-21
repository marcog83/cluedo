let MovementController = require("./game/MovementController");
let bw = require("./bitwise/bw");
let {fromNumberToName} = require("./utils/utils");
let Cards = require("./bitwise/Cards");
let AIPlayer = require("./ai/AIPlayer");
let Game = require("./game/GamePlay");
let Cluedo = require("./game/Cluedo");
let Player = require("./game/Player");

let game = new Game();

//
//

Cluedo.players.push(new Player({
    id: Cards.PLUM,
    controller: new AIPlayer(),
    movement: new MovementController()
}));
Cluedo.players.push(new Player({
    id: Cards.SCARLETT,
    controller: new AIPlayer(),
    movement: new MovementController()
}));
Cluedo.players.push(new Player({
    id: Cards.WHITE,
    controller: new AIPlayer(),
    movement: new MovementController()
}));
Cluedo.players.push(new Player({
    id: Cards.GREEN,
    controller: new AIPlayer(),
    movement: new MovementController()
}));
Cluedo.players.push(new Player({
    id: Cards.PEACOCK,
    controller: new AIPlayer(),
    movement: new MovementController()
}));
Cluedo.players.push(new Player({
    id: Cards.MUSTARD,
    controller: new AIPlayer(),
    movement: new MovementController()
}));


game.on("Win", function (player, {room, weapon, suspect}, solution) {


    console.log("You Win! " + player.toString());
    console.log("Your accusation =>", fromNumberToName(suspect), fromNumberToName(weapon), fromNumberToName(room))
    console.log("Your accusation =>", bw.numToBinaryArray(room | weapon | suspect));
    console.log("       Solution =>", bw.numToBinaryArray(solution));

});
game.on("Failed", function (player, accusation, solution) {

    console.log("You Failed! " + player.toString());
    console.log("Your accusation =>", bw.numToBinaryArray(accusation));
    console.log("       Solution =>", bw.numToBinaryArray(solution));
});


game.on("TurnCompleted", () => {
    setTimeout(() => {

        game.nextPlayer();
    }, 50)
});
game.start();
//