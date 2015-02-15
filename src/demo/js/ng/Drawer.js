define(function (require, exports, module) {
    'use strict';
    var $ = require("jquery");
    var BoardGrid = require("../../../game/BoardTXT");
    var INVALIDATE_PAINT = true;

    function Drawer(players) {
        this.players = players;
        requestAnimationFrame(this.draw.bind(this))
    }

    Drawer.prototype = {
        drawBoard: function () {
            this.board = $("<div class='tiles'></div>");
            BoardGrid.forEach(function (row, i) {
                var rowDOM = $("<div class='row'></div>");
                row.forEach(function (cell, j) {

                    var type = cell ? "wall" : "walkable";
                    $("<div class='col icon' id='cell_" + (i  ) + "_" + (j  ) + "'></div>")
                        .addClass(type)
                        .appendTo(rowDOM);
                });
                this.board.append(rowDOM);
            }.bind(this));
            $("#board").append(this.board);
            this.update();
        },
        update: function () {
            INVALIDATE_PAINT = true;
        },
        draw: function () {
            if (!INVALIDATE_PAINT) {
                TweenMax.delayedCall(.05,this.draw.bind(this));
               // requestAnimationFrame(this.draw.bind(this));
                return;
            } else {
                this.board.find(".col")
                    .removeClass("mustard green plum scarlett white peacock");
                this.players.forEach(function (player) {
                    var location=player.location;
                    var selector = "#cell_" + (location.y) + "_" + (location.x);
                    this.board.find(selector)
                        .addClass(player.config.label.toLowerCase());
                }.bind(this));
                TweenMax.delayedCall(.05,this.draw.bind(this));
               // requestAnimationFrame(this.draw.bind(this));
            }


            //INVALIDATE_PAINT = false;

        }
    };

    module.exports = Drawer;
});