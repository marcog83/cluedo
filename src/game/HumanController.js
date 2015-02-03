define(function (require, exports, module) {
    'use strict';
    var EvidenceSheet = require("./EvidenceSheet");
    var Cluedo = require("./Cluedo");
    var Suggestion = require("./Suggestion");

    var utils = require("../utils/utils");

    function HumanController() {

    };
    HumanController.prototype = {
        setHand: function (hand) {

            this.hand = hand;
            this.evidenceSheet = new EvidenceSheet();
            this.hand.forEach(function (card) {
                this.evidenceSheet.seeCard(card);
            }.bind(this));
        },
        seeCard: function (suggestion, card, asked, couldNotAnswer) {
            return this.evidenceSheet.seeCard(card);
        },

        ask: function (questionair, suggestion) {
            this.hand = utils.shuffle(this.hand);
            return _.find(this.hand, function (c) {
                return c == suggestion.weapon || c == suggestion.suspect || c == suggestion.room
            });
        },
        stayOrLeave: function () {
            return new Promise(function (resolve, reject) {

                setTimeout(function () {
                    alertify.set({
                        labels: {
                            ok: "Stay",
                            cancel: "Leave"
                        }
                    });
                    alertify.confirm("Cosa vuoi fare?", function (e) {
                        if (e) {
                            // user clicked "Stay"

                            resolve();

                        } else {
                            reject();
                            // user clicked "Leave"
                        }
                    });
                }, 500);
            });
        },
        suggest: function (player) {
            var suggestion = new Suggestion(player);
            return this.setSuspect()
                .then(this.setWeapon.bind(this))
                .then(function (response) {
                    var s = response[0];
                    var w = response[1];
                    suggestion.suspectListener(s);
                    suggestion.weaponListener(w);
                    return suggestion
                }.bind(this));

        },
        setSuspect: function () {

            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    alertify.set({
                        labels: {
                            ok: "Ok",
                            cancel: "cancel"
                        }
                    });
                    var suspects = _.difference(Cluedo.suspects, this.hand);
                    alertify.prompt("il sospettato è...\n" + suspects.map(function (s) {
                        return s.name;
                    }), function (e, suspect) {
                        // str is the input text
                        if (e) {
                            resolve([suspect]);
                        } else {
                            // user clicked "cancel"
                        }
                    });
                }.bind(this), 1000);
            }.bind(this))
        },
        setWeapon: function (partial) {
            var hand = this.hand;
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    var weapons = _.difference(Cluedo.weapons, hand);
                    alertify.prompt("l' arma è...\n" + weapons.map(function (w) {
                        return w.name;
                    }), function (e, weapon) {
                        // str is the input text
                        if (e) {
                            partial.push(weapon);
                            resolve(partial);

                        } else {
                            // user clicked "cancel"
                        }
                    });


                }.bind(this), 1000)
            }.bind(this))
        }
    };
    module.exports = HumanController;
});