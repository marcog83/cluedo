define(function (require, exports, module) {
    'use strict';
    var Cluedo=require("../game/Cluedo");
    var table = $(".table");
    module.exports = {
        init: function () {
            for (var i = 0; i < 29; i++) {
                var row = $("<tr></tr>");
                for (var j = 0; j < 24; j++) {
                    var td = $("<td></td>");
                    td.data("x", j);
                    td.data("y", i);
                    row.append(td);
                }
                table.append(row);
            }
        },
        draw: function (squares, rooms, selection) {
            var color;

            if (squares != null) {
                $(".table tr td").removeClass("blueviolet red green yellow cyan");
                for (var i = 0; i < squares.length; i++) {
                    var sq = squares[i];
                    var x = sq.getCoord().x;
                    var y = sq.getCoord().y;
                    if (sq.entrance != null && rooms.indexOf(sq.entrance.room) != -1){
                        color = 'green';
                    }else{
                        color = ('yellow');
                    }

                    $(".table tr").eq(y).find("td").eq(x).addClass(color);
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
                $(".table tr").eq(p.y).find("td").eq(p.x).addClass(color);
            });

        },
        drawSuspects:function(){
            var color='blueviolet';
            var p;
            var x, y;
            for(var i=0; i< Cluedo.suspects.length;i++){
                var s=Cluedo.suspects[i];
                p = s.location;
                if(p!=null && s.room==null){
                    x = p.x ;
                    y = p.y ;

                    $(".table tr").eq(y).find("td").eq(x).addClass(color);
                }
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
                    $(".table tr").eq(y).find("td").eq(x).addClass(color);

                }
            }
        }
    };
});