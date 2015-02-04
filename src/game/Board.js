define(function (require, exports, module) {
    'use strict';
    var BoardTXT = require("./BoardTXT");
    var DoorsTXT = require("./DoorsTXT");
    var Square = require("./Square");
    var Point = require("../utils/Point");

    function Board() {

        this.width = 24;
        this.height = 29;
        this.house = [[]];
        this.readBoard();
    }

    Board.prototype = {
        squareAt: function (point) {
           /* var x = point.x;
            var y = point.y;
            if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;
            else return this.house[y][x];*/
        },
        readBoard: function () {
/*
            var pos;


            //
            BoardTXT.forEach(function (rowTXT, i) {
                var _row = [];
                for (var j = 0; j < rowTXT.length; j++) {
                    pos = new Square(rowTXT[j], j, i);
                    _row[j] = pos;
                }
                this.house[i] = _row;

            }.bind(this));
            DoorsTXT.forEach(function (rowTXT, i) {
                for (var j = 0; j < rowTXT.length; j++) {
                    if (rowTXT[j] != '0') {
                        pos = this.house[i][j];
                        pos.setEntranceTo(rowTXT[j]);
                    }
                }

            }.bind(this));
*/
            //
        },
        nearbyRooms: function (point, roll) {
           /* var rooms = [];
            var col = point.x;
            var row = point.y;
            //If the square at this position is an entrance to a room, add it to the Set.
            if (this.house[row][col].entrance != null)
                rooms.push(this.house[row][col].entrance.room);
            if (roll > 1) {
                //Player needs another 1 space to move after reaching the entrance, to enter.
                var up = new Point(col, row - 1);
                var down = new Point(col, row + 1);
                var left = new Point(col - 1, row);
                var right = new Point(col + 1, row);
                //Checks the points are both in the house, and no inside rooms (hence, through walls).
                if (this.squareAt(up) != null && !this.squareAt(up).isRoom())
                    rooms = _.union(rooms,this.nearbyRooms(up, roll - 1));
                if (this.squareAt(down) != null && !this.squareAt(down).isRoom())
                    rooms = _.union(rooms,this.nearbyRooms(down, roll - 1));
                if (this.squareAt(left) != null && !this.squareAt(left).isRoom())
                    rooms = _.union(rooms,this.nearbyRooms(left, roll - 1));
                if (this.squareAt(right) != null && !this.squareAt(right).isRoom())
                    rooms = _.union(rooms,this.nearbyRooms(right, roll - 1));
            }
            return rooms;*/
        },
        nearbySquares: function (point, from, roll) {
           /* var squares = [];
            var square = this.squareAt(point);
            square.setMoveFrom(from);
            var col = point.x;
            var row = point.y;
            if (square.occupant == null) squares.push(square);
            if (roll > 0) {
                var up = new Point(col, row - 1);
                var down = new Point(col, row + 1);
                var left = new Point(col - 1, row);
                var right = new Point(col + 1, row);
                //Checks the points are both in the house, and no inside rooms (hence, through walls).
                if (this.squareAt(up) != null && !this.squareAt(up).isRoom())
                    squares = _.union(squares,this.nearbySquares(up, point, roll - 1));
                if (this.squareAt(down) != null && !this.squareAt(down).isRoom())
                    squares = _.union(squares,this.nearbySquares(down, point, roll - 1));
                if (this.squareAt(left) != null && !this.squareAt(left).isRoom())
                    squares = _.union(squares,this.nearbySquares(left, point, roll - 1));
                if (this.squareAt(right) != null && !this.squareAt(right).isRoom())
                    squares = _.union(squares,this.nearbySquares(right, point, roll - 1));
            }
            return squares;*/
        },
        print: function () {
            this.house.forEach(function (row) {
                console.log(row);
            });
        }

    };
    module.exports = Board;
});