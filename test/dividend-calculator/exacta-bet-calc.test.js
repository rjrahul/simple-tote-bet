'use strict';

var Bet = require('../../app/bet');
var ExactaBetCalc = require('../../app/dividend-calculator/exacta-bet-calc');
var Promise = require('bluebird');
var DividendCalc = Promise.promisify(ExactaBetCalc.calculateDividend);
var createBet = Promise.promisify(Bet.create);
var RaceResult = require('../../app/race-result');

describe('ExactaBet Dividend Calculator', () => {
    it('should mandate race results', () => {
        return DividendCalc()
            .then(() => {
                throw new Error('should not be here');
            }).catch((e) => {
                expect(e.message).to.equal('RaceResult is mandatory');
            });
    });

    it('should pay 0 dividend when no Exacta bet is applied', () => {
        var result = new RaceResult(['1', '2', '3']);
        return DividendCalc(result, [])
            .then((dividend) => {
                expect(dividend).to.equal(0);
            });
    });
    it('should pay 0 dividend when no bets array is sent', () => {
        var result = new RaceResult(['1', '2', '3']);
        return DividendCalc(result)
            .then((dividend) => {
                expect(dividend).to.equal(0);
            });
    });

    it('should pay full dividend for only winning bet', () => {
        var result = new RaceResult(['1', '2', '3']);
        var bets = [];
        return createBet('E', ['1', '2'], '2')
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
        return createBet('E', ['2', '1'], '2')
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
        return createBet('E', ['1', '2'], '2')
            .then((bet) => {
                bets.push(bet);
                return DividendCalc(result, bets, '0.1');
            }).then((dividend) => {
                expect(dividend).to.equal(0.9);
            });
    });

    it('should pay appropriated dividend', () => {
        var result = new RaceResult(['2', '3', '1']);
        var bets = [];
        return createBet('E', ['1', '2'], '13')
            .then((bet) => {
                bets.push(bet);
                return createBet('E', ['2', '3'], '98');
            }).then((bet) => {
                bets.push(bet);
                return createBet('E', ['1', '3'], '82');
            }).then((bet) => {
                bets.push(bet);
                return createBet('E', ['3', '2'], '27');
            }).then((bet) => {
                bets.push(bet);
                return createBet('E', ['1', '2'], '5');
            }).then((bet) => {
                bets.push(bet);
                return createBet('E', ['2', '3'], '61');
            }).then((bet) => {
                bets.push(bet);
                return createBet('E', ['1', '3'], '28');
            }).then((bet) => {
                bets.push(bet);
                return createBet('E', ['3', '2'], '25');
            }).then((bet) => {
                bets.push(bet);
                return createBet('E', ['1', '2'], '81');
            }).then((bet) => {
                bets.push(bet);
                return createBet('E', ['2', '3'], '47');
            }).then((bet) => {
                bets.push(bet);
                return createBet('E', ['1', '3'], '93');
            }).then((bet) => {
                bets.push(bet);
                return createBet('E', ['3', '2'], '51');
            }).then((bet) => {
                bets.push(bet);
                return DividendCalc(result, bets, '0.18');
            }).then((dividend) => {
                expect(dividend).to.equal(2.43);
            });
    });
});