let BoardGrid = require("./BoardTXT");
let Doors = require("./DoorsTXT");
let PF = require("pathfinding");


class Board {
    constructor() {
        this.width = 24;
        this.height = 29;
        this.house;
        this.readBoard();
    }

    readBoard() {

        this.grid = BoardGrid;
        this.house = new PF.Grid(BoardGrid[0].length, BoardGrid.length, BoardGrid);
        this.finder = new PF.AStarFinder({
            allowDiagonal: false,
            dontCrossCorners: false,
            diagonalMovement: false
        });

        //

    }

    findPath(location, toRoom) {
        let _doors = Doors[toRoom];
        let path = _doors
            .map(function (door) {
                return this.finder.findPath(location.x, location.y, door.x, door.y, this.house.clone());
            }.bind(this))
            .reduce(function (prev, path) {
                if (prev.length < 1) return path;
                return (prev && path && path.length < prev.length) ? path : prev;

            }, []);
        // return this.finder.findPath(location.x , location.y , _doors.x , _doors.y , this.house.clone());
        return path;
    }
}


module.exports = new Board();