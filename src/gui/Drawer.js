define(function (require, exports, module) {
    'use strict';
    var Cluedo=require("../game/Cluedo");
    var table = $(".table");
    module.exports = {
        init: function () {
            this.grid=[];
            for (var i = 0; i < 29; i++) {
                var row = $("<tr></tr>");
                this.grid[i]=[];
                for (var j = 0; j < 24; j++) {

                    var td = $("<td></td>");
                    this.grid[i][j]=td;

                    row.append(td);
                }
                table.append(row);
            }
        },
        draw: function (squares, rooms, selection) {
            var color;

            if (squares != null) {
                $(".table tr td").attr('class', '');
                for (var i = 0; i < squares.length; i++) {
                    var sq = squares[i];
                    var x = sq.getCoord().x;
                    var y = sq.getCoord().y;
                    if (sq.entrance != null && rooms.indexOf(sq.entrance.room) != -1){
                        color = 'green';
                    }else{
                        color = ('yellow');
                    }
                    this.grid[y][x].addClass(color);

                    if (sq.room != null) {
                        this.drawExits(sq.room);
                    }

                }
            }

            this.drawSuspects();

        },
        drawExits: function (r) {
            var color = 'cyan';
            r.exits.forEach(function (p) {
                this.grid[p.y][p.x].addClass(color);
            }.bind(this));

        },
        drawSuspects:function(){
            var color='blueviolet';
            var p;
            var x, y;
            for(var i=0; i< Cluedo.suspects.length;i++){
                var s=Cluedo.suspects[i];
                p = s.location;

                p && this.grid[p.y][p.x].addClass(s.color);
            }
            //For if they're inside a room
            for(var i=0; i< Cluedo.rooms.length;i++){
                var r=Cluedo.rooms[i];
               var suspects = r.getOccupants();
                if(!suspects.length) continue;

                p = r.getStart();
                for(var j=0; j<suspects.length;j++){
                    x = p.x ;
                    y = (p.y+i) ;
                    try{
                        this.grid[y][x].addClass(color);
                    }catch (e){

                    }


                }
            }
        }
    };
});