'use strict';

var _ = require('lodash');
var Bet = require('../../app/bet');
var Promise = require('bluebird');
var DividendCalc = require('../../app/dividend-calculator');
DividendCalc = Promise.promisify(DividendCalc.calculateDividend);
var createBet = Promise.promisify(Bet.create);
var RaceResult = require('../../app/race-result');
var Race = require('../../app/race');
var WinBetCalc = require('../../app/dividend-calculator/win-bet-calc');
var TestCommissions = {'W': '0.15', 'P': '0.12', 'E': '0.18'};

describe('Dividend Calculator', () => {
    it('should mandate race', () => {
        return DividendCalc()
            .then(() => {
                throw new Error('it should not be here');
            }).catch((e) => {
                expect(e.message).to.equal('Concluded race is mandatory for calculating dividends');
            });
    });
    it('should mandate race is concluded', () => {
        return DividendCalc(new Race())
            .then(() => {
                throw new Error('it should not be here');
            }).catch((e) => {
                expect(e.message).to.equal('Concluded race is mandatory for calculating dividends');
            });
    });
    
    it('should calculate correct dividend based on bets applied', () => {
        var race = new Race('Final race', '2017-07-24', TestCommissions);
        race.promisifiedApplyBet = Promise.promisify(race.applyBet);
        race.promisifiedConclude = Promise.promisify(race.conclude);
        var result = new RaceResult(['1', '2', '3']);
        var bets = [];
        return createBet('W', '2', '2')
            .then((bet) => {
                return race.promisifiedApplyBet(bet);
            }).then(() => {
                return createBet('W', '1', '3');
            }).then((bet) => {
                return race.promisifiedApplyBet(bet);
            }).then(() => {
                return createBet('W', '1', '2');
            }).then((bet) => {
                return race.promisifiedApplyBet(bet);
            }).then(() => {
                return createBet('E', ['1', '2'], '2');
            }).then((bet) => {
                return race.promisifiedApplyBet(bet);
            }).then(() => {
                return createBet('E', ['2', '1'], '3');
            }).then((bet) => {
                return race.promisifiedApplyBet(bet);
            }).then(() => {
                return createBet('E', ['1', '2'], '3');
            }).then((bet) => {
                return race.promisifiedApplyBet(bet);
            }).then(() => {
                return createBet('P', '1', '2');
            }).then((bet) => {
                return race.promisifiedApplyBet(bet);
            }).then(() => {
                return createBet('P', '1', '3');
            }).then((bet) => {
                return race.promisifiedApplyBet(bet);
            }).then(() => {
                return createBet('P', '4', '2');
            }).then((bet) => {
                return race.promisifiedApplyBet(bet);
            }).then(() => {
                return createBet('P', '5', '5');
            }).then((bet) => {
                return race.promisifiedApplyBet(bet);
            }).then(() => {
                return createBet('P', '2', '2');
            }).then((bet) => {
                return race.promisifiedApplyBet(bet);
            }).then(() => {
                return createBet('P', '2', '2');
            }).then((bet) => {
                return race.promisifiedApplyBet(bet);
            }).then(() => {
                return createBet('P', '6', '7');
            }).then((bet) => {
                return race.promisifiedApplyBet(bet);
            }).then(() => {
                return createBet('P', '3', '4');
            }).then((bet) => {
                return race.promisifiedApplyBet(bet);
            }).then(() => {
                return createBet('P', '3', '3');
            }).then((bet) => {
                return race.promisifiedApplyBet(bet);
            }).then(() => {
                return race.promisifiedConclude(result);
            }).then(() => {
                return DividendCalc(race);
            }).then((dividend) => {
                var PWinPool = (14 * (1 - TestCommissions.P)) / 3;
                var expectedDividend = {
                    'W': _.floor((2 * (1 - TestCommissions.W)) / 5, 2),
                    'P': [_.floor(PWinPool / 5, 2), _.floor(PWinPool / 4, 2), _.floor(PWinPool / 7, 2)],
                    'E': _.floor((3 * (1 - TestCommissions.E)) / 5, 2)
                };
                expect(dividend).to.deep.equal(expectedDividend);
            });
    });
    
    it('should validate error handling in calculate dividend', () => {
        var race = new Race('Error race', '2017-07-24', TestCommissions);
        race.promisifiedApplyBet = Promise.promisify(race.applyBet);
        race.promisifiedConclude = Promise.promisify(race.conclude);
        var result = new RaceResult(['1', '2', '3']);
        var bets = [];
        var stub = sinon.stub(WinBetCalc, 'calculateDividend').callsFake(function() {
            throw new Error('A dummy error');
        });

        return createBet('W', '2', '2')
            .then((bet) => {
                return race.promisifiedApplyBet(bet);
            }).then(() => {
                return race.promisifiedConclude(result);
            }).then(() => {
                return DividendCalc(race);
            }).then(() => {
                throw new Error('it should not be here');
            }).catch((e) => {
                expect(e.message).to.equal('A dummy error');
                WinBetCalc.calculateDividend.restore();
            });
    });
});