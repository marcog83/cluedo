let Dice = {
    roll: () => {
        let d1 = 1 + parseInt(Math.random() * 6);
        let d2 = 1 + parseInt(Math.random() * 6);
        return d1 + d2;
    }
};
module.exports = Dice;