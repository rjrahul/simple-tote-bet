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
    it('should mandate bets when array of length 0', () => {
        var result = new RaceResult(['1', '2', '3']);
        return DividendCalc(result, [])
            .then((dividend) => {
                expect(dividend).to.equal(0);
            });
    });
    it('should mandate bets when no bets array is specified', () => {
        var result = new RaceResult(['1', '2', '3']);
        return DividendCalc(result)
            .then((dividend) => {
                expect(dividend).to.equal(0);
            });
    });

    it('should pay appropriate dividend for only winning bet', () => {
        var result = new RaceResult(['1', '2', '3']);
        var bets = [];
        return createBet('W', '1', '2')
            .then((bet) => {
                bets.push(bet);
                return DividendCalc(result, bets);
            }).then((dividend) => {
                expect(dividend).to.equal(1);
            });
    });

    it('should pay 0 dividend for only losing bet', () => {
        var result = new RaceResult(['1', '2', '3']);
        var bets = [];
        return createBet('W', '2', '2')
            .then((bet) => {
                bets.push(bet);
                return DividendCalc(result, bets);
            }).then((dividend) => {
                expect(dividend).to.equal(0);
            });
    });

    it('should pay dividend after accepting commission', () => {
        var result = new RaceResult(['1', '2', '3']);
        var bets = [];
        return createBet('W', '1', '2')
            .then((bet) => {
                bets.push(bet);
                return DividendCalc(result, bets, '0.15');
            }).then((dividend) => {
                expect(dividend).to.equal(0.85);
            });
    });

    it('should pay appropriated dividend', () => {
        var result = new RaceResult(['2', '3', '1']);
        var bets = [];
        return createBet('W', '1', '3')
            .then((bet) => {
                bets.push(bet);
                return createBet('W', '2', '4');
            }).then((bet) => {
                bets.push(bet);
                return createBet('W', '3', '5');
            }).then((bet) => {
                bets.push(bet);
                return createBet('W', '4', '5');
            }).then((bet) => {
                bets.push(bet);
                return createBet('W', '1', '16');
            }).then((bet) => {
                bets.push(bet);
                return createBet('W', '2', '8');
            }).then((bet) => {
                bets.push(bet);
                return createBet('W', '3', '22');
            }).then((bet) => {
                bets.push(bet);
                return createBet('W', '4', '57');
            }).then((bet) => {
                bets.push(bet);
                return createBet('W', '1', '42');
            }).then((bet) => {
                bets.push(bet);
                return createBet('W', '2', '98');
            }).then((bet) => {
                bets.push(bet);
                return createBet('W', '3', '63');
            }).then((bet) => {
                bets.push(bet);
                return createBet('W', '4', '15');
            }).then((bet) => {
                bets.push(bet);
                return DividendCalc(result, bets, '0.15');
            }).then((dividend) => {
                expect(dividend).to.equal(2.61);
            });
    });
});