'use strict';

var Bet = require('../../app/bet');
var PlaceBetCalc = require('../../app/dividend-calculator/place-bet-calc');
var Promise = require('bluebird');
var DividendCalc = Promise.promisify(PlaceBetCalc.calculateDividend);
var createBet = Promise.promisify(Bet.create);
var RaceResult = require('../../app/race-result');

describe('PlaceBet Dividend Calculator', () => {
    it('should mandate race results', () => {
        return DividendCalc()
            .then(() => {
                throw new Error('should not be here');
            }).catch((e) => {
                expect(e.message).to.equal('RaceResult is mandatory');
            });
    });
    it('should pay 0 dividend each if there are no bets', () => {
        var result = new RaceResult(['1', '2', '3']);
        return DividendCalc(result, [])
            .then((dividend) => {
                expect(dividend).to.be.an.instanceOf(Array).with.lengthOf(3);
                expect(dividend).to.deep.equal([0, 0, 0]);
            });
    });
    it('should pay 0 dividend each if no bets array is specified', () => {
        var result = new RaceResult(['1', '2', '3']);
        return DividendCalc(result)
            .then((dividend) => {
                expect(dividend).to.be.an.instanceOf(Array).with.lengthOf(3);
                expect(dividend).to.deep.equal([0, 0, 0]);
            });
    });

    it('should pay correct dividend for only winning bet of first position', () => {
        var result = new RaceResult(['1', '2', '3']);
        var bets = [];
        return createBet('P', '1', '2')
            .then((bet) => {
                bets.push(bet);
                return DividendCalc(result, bets);
            }).then((dividend) => {
                expect(dividend).to.be.an.instanceOf(Array).with.lengthOf(3);
                expect(dividend).to.deep.equal([0.33, 0, 0]);
            });
    });

    it('should pay correct dividend for only winning bet of second position', () => {
        var result = new RaceResult(['1', '2', '3']);
        var bets = [];
        return createBet('P', '2', '2')
            .then((bet) => {
                bets.push(bet);
                return DividendCalc(result, bets);
            }).then((dividend) => {
                expect(dividend).to.be.an.instanceOf(Array).with.lengthOf(3);
                expect(dividend).to.deep.equal([0, 0.33, 0]);
            });
    });

    it('should pay correct dividend for only winning bet of third position', () => {
        var result = new RaceResult(['1', '2', '3']);
        var bets = [];
        return createBet('P', '3', '2')
            .then((bet) => {
                bets.push(bet);
                return DividendCalc(result, bets);
            }).then((dividend) => {
                expect(dividend).to.be.an.instanceOf(Array).with.lengthOf(3);
                expect(dividend).to.deep.equal([0, 0, 0.33]);
            });
    });

    it('should pay 0 dividend for only losing bet', () => {
        var result = new RaceResult(['1', '2', '3']);
        var bets = [];
        return createBet('P', '4', '3')
            .then((bet) => {
                bets.push(bet);
                return DividendCalc(result, bets);
            }).then((dividend) => {
                expect(dividend).to.be.an.instanceOf(Array).with.lengthOf(3);
                expect(dividend).to.deep.equal([0, 0, 0]);
            });
    });

    it('should pay dividend after accepting commission', () => {
        var result = new RaceResult(['1', '2', '3']);
        var bets = [];
        return createBet('P', '1', '4')
            .then((bet) => {
                bets.push(bet);
                return DividendCalc(result, bets, '0.12');
            }).then((dividend) => {
                expect(dividend).to.be.an.instanceOf(Array).with.lengthOf(3);
                expect(dividend).to.deep.equal([0.29, 0, 0]);
            });
    });

    it('should pay appropriated dividend', () => {
        var result = new RaceResult(['2', '3', '1']);
        var bets = [];
        return createBet('P', '1', '31')
            .then((bet) => {
                bets.push(bet);
                return createBet('P', '2', '89');
            }).then((bet) => {
                bets.push(bet);
                return createBet('P', '3', '28');
            }).then((bet) => {
                bets.push(bet);
                return createBet('P', '4', '72');
            }).then((bet) => {
                bets.push(bet);
                return createBet('P', '1', '40');
            }).then((bet) => {
                bets.push(bet);
                return createBet('P', '2', '16');
            }).then((bet) => {
                bets.push(bet);
                return createBet('P', '3', '82');
            }).then((bet) => {
                bets.push(bet);
                return createBet('P', '4', '52');
            }).then((bet) => {
                bets.push(bet);
                return createBet('P', '1', '18');
            }).then((bet) => {
                bets.push(bet);
                return createBet('P', '2', '74');
            }).then((bet) => {
                bets.push(bet);
                return createBet('P', '3', '39');
            }).then((bet) => {
                bets.push(bet);
                return createBet('P', '4', '105');
            }).then((bet) => {
                bets.push(bet);
                return DividendCalc(result, bets, '0.12');
            }).then((dividend) => {
                expect(dividend).to.be.an.instanceOf(Array).with.lengthOf(3);
                expect(dividend).to.deep.equal([1.06, 1.27, 2.13]);
            });
    });
});