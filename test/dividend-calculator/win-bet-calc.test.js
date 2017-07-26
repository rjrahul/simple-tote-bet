'use strict';

var Bet = require('../../app/bet');
var WinBetCalc = require('../../app/dividend-calculator/win-bet-calc');
var Promise = require('bluebird');
var DividendCalc = Promise.promisify(WinBetCalc.calculateDividend);
var createBet = Promise.promisify(Bet.create);
var RaceResult = require('../../app/race-result');

describe('WinBet Dividend Calculator', () => {
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
                expect(e.message).to.equal('Bets should be an array of minimum 1 WinBet');
            });
    });
    it('should mandate bets when not array', () => {
        var result = new RaceResult(['1', '2', '3']);
        return DividendCalc(result, 'a')
            .then(() => {
                throw new Error('should not be here');
            }).catch((e) => {
                expect(e.message).to.equal('Bets should be an array of minimum 1 WinBet');
            });
    });
    it('should mandate bets when array of length 0', () => {
        var result = new RaceResult(['1', '2', '3']);
        return DividendCalc(result, [])
            .then(() => {
                throw new Error('should not be here');
            }).catch((e) => {
                expect(e.message).to.equal('Bets should be an array of minimum 1 WinBet');
            });
    });

    it('should pay 0 dividend for only winning bet', () => {
        var result = new RaceResult(['1', '2', '3']);
        var bets = [];
        return createBet('W', '1', '2')
            .then((bet) => {
                bets.push(bet);
                return DividendCalc(result, bets);
            }).then((dividend) => {
                expect(dividend).to.equal(0);
            });
    });

    it('should pay full dividend for only losing bet', () => {
        var result = new RaceResult(['1', '2', '3']);
        var bets = [];
        return createBet('W', '2', '2')
            .then((bet) => {
                bets.push(bet);
                return DividendCalc(result, bets);
            }).then((dividend) => {
                expect(dividend).to.equal(2);
            });
    });

    it('should pay dividend after accepting commission', () => {
        var result = new RaceResult(['1', '2', '3']);
        var bets = [];
        return createBet('W', '2', '2')
            .then((bet) => {
                bets.push(bet);
                return DividendCalc(result, bets, '0.1');
            }).then((dividend) => {
                expect(dividend).to.equal(1.8);
            });
    });

    it('should pay appropriated dividend', () => {
        var result = new RaceResult(['1', '2', '3']);
        var bets = [];
        return createBet('W', '2', '2')
            .then((bet) => {
                bets.push(bet);
                return createBet('W', '1', '3');
            }).then((bet) => {
                bets.push(bet);
                return createBet('W', '1', '2');
            }).then((bet) => {
                bets.push(bet);
                return DividendCalc(result, bets, '0.1');
            }).then((dividend) => {
                expect(dividend).to.equal(1.8/5);
            });
    });
});