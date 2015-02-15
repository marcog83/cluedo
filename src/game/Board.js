define(function (require, exports, module) {
    'use strict';
    var BoardGrid = require("./BoardTXT");
    var Doors = require("./DoorsTXT");
    var PF = require("pathfinding");


    function Board() {

        this.width = 24;
        this.height = 29;
        this.house;
        this.readBoard();
    }

    Board.prototype = {
        readBoard: function () {

            this.grid = BoardGrid;
            this.house = new PF.Grid(BoardGrid[0].length, BoardGrid.length, BoardGrid);
            this.finder = new PF.AStarFinder({
                allowDiagonal: false,
                dontCrossCorners: false,
                diagonalMovement:false
            });

            //

        },
        findPath: function (location, toRoom) {
            var _doors = Doors[toRoom];
            var path = _doors
                .map(function (door) {
                    return this.finder.findPath(location.x , location.y , door.x , door.y , this.house.clone());
                }.bind(this))
                .reduce(function (prev, path) {
                    if (prev.length < 1)return path;
                    return (prev && path && path.length < prev.length) ? path : prev;

                }, []);
           // return this.finder.findPath(location.x , location.y , _doors.x , _doors.y , this.house.clone());
            return path;
        }

    };
    module.exports = new Board();
});