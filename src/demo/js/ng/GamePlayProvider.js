define(function (require, exports, module) {
    'use strict';
    var GamePlay = require("../../../game/GamePlay");
    var GamePlayProvider = {
        game: new GamePlay(),
        $get: function () {
            return this.game;
        }
    };
    module.exports = GamePlayProvider;
});