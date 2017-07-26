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
    it('should mandate bets array', () => {
        var result = new RaceResult(['1', '2', '3']);
        return DividendCalc(result)
            .then(() => {
                throw new Error('should not be here');
            }).catch((e) => {
                expect(e.message).to.equal('Bets should be an array of minimum 1 PlaceBet');
            });
    });
    it('should mandate bets when not array', () => {
        var result = new RaceResult(['1', '2', '3']);
        return DividendCalc(result, 'a')
            .then(() => {
                throw new Error('should not be here');
            }).catch((e) => {
                expect(e.message).to.equal('Bets should be an array of minimum 1 PlaceBet');
            });
    });
    it('should mandate bets when array of length 0', () => {
        var result = new RaceResult(['1', '2', '3']);
        return DividendCalc(result, [])
            .then(() => {
                throw new Error('should not be here');
            }).catch((e) => {
                expect(e.message).to.equal('Bets should be an array of minimum 1 PlaceBet');
            });
    });

    it('should pay 0 dividend for only winning bet of first position', () => {
        var result = new RaceResult(['1', '2', '3']);
        var bets = [];
        return createBet('P', '1', '2')
            .then((bet) => {
                bets.push(bet);
                return DividendCalc(result, bets);
            }).then((dividend) => {
                expect(dividend).to.be.an.instanceOf(Array).with.lengthOf(3);
                expect(dividend).to.deep.equal([0, 0, 0]);
            });
    });

    it('should pay 0 dividend for only winning bet of second position', () => {
        var result = new RaceResult(['1', '2', '3']);
        var bets = [];
        return createBet('P', '2', '2')
            .then((bet) => {
                bets.push(bet);
                return DividendCalc(result, bets);
            }).then((dividend) => {
                expect(dividend).to.be.an.instanceOf(Array).with.lengthOf(3);
                expect(dividend).to.deep.equal([0, 0, 0]);
            });
    });

    it('should pay 0 dividend for only winning bet of third position', () => {
        var result = new RaceResult(['1', '2', '3']);
        var bets = [];
        return createBet('P', '3', '2')
            .then((bet) => {
                bets.push(bet);
                return DividendCalc(result, bets);
            }).then((dividend) => {
                expect(dividend).to.be.an.instanceOf(Array).with.lengthOf(3);
                expect(dividend).to.deep.equal([0, 0, 0]);
            });
    });

    it('should pay full dividend for only losing bet', () => {
        var result = new RaceResult(['1', '2', '3']);
        var bets = [];
        return createBet('P', '4', '3')
            .then((bet) => {
                bets.push(bet);
                return DividendCalc(result, bets);
            }).then((dividend) => {
                expect(dividend).to.be.an.instanceOf(Array).with.lengthOf(3);
                expect(dividend).to.deep.equal([1, 1, 1]);
            });
    });

    it('should pay dividend after accepting commission', () => {
        var result = new RaceResult(['1', '2', '3']);
        var bets = [];
        return createBet('P', '4', '4')
            .then((bet) => {
                bets.push(bet);
                return DividendCalc(result, bets, '0.25');
            }).then((dividend) => {
                expect(dividend).to.be.an.instanceOf(Array).with.lengthOf(3);
                expect(dividend).to.deep.equal([1, 1, 1]);
            });
    });

    it('should pay appropriated dividend', () => {
        var result = new RaceResult(['1', '2', '3']);
        var bets = [];
        return createBet('P', '4', '5')
            .then((bet) => {
                bets.push(bet);
                return createBet('P', '1', '3');
            }).then((bet) => {
                bets.push(bet);
                return createBet('P', '1', '2');
            }).then((bet) => {
                bets.push(bet);
                return createBet('P', '2', '2');
            }).then((bet) => {
                bets.push(bet);
                return DividendCalc(result, bets, '0.1');
            }).then((dividend) => {
                expect(dividend).to.be.an.instanceOf(Array).with.lengthOf(3);
                expect(dividend).to.deep.equal([1.5/5, 1.5/2, 1.5]);
            });
    });
});