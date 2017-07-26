'use strict';

var Promise = require('bluebird');
var Race = require('../../app/race');
var Bet = require('../../app/bet');
var RaceResult = require('../../app/race-result');
var TestCommissions = {'W': '0.15', 'P': '0.12', 'E': '0.18'};

describe('Race', () => {
    it('should be able to create a new race', () => {
        var race = new Race('First race', '2017-07-24', TestCommissions);
        
        expect(race.name).to.equal('First race');
        expect(race.date).to.equal('2017-07-24');
        expect(race.commissions).to.equal(TestCommissions);
        expect(race.id).to.be.ok;
    });

    it('should be able to apply a bet to the race', () => {
        var race = new Race('Apply 1 bet', '2017-07-24', TestCommissions);
        var createBet = Promise.promisify(Bet.create);
        race.promisifiedApplyBet = Promise.promisify(race.applyBet);
        race.promisifiedBetsOfType = Promise.promisify(race.betsOfType);
        var bet;
        return createBet('W', '2', '3')
            .then((newBet) => {
                bet = newBet;
                return race.promisifiedApplyBet(newBet);
            }).then(() => {
                return race.promisifiedBetsOfType('W');
            }).then((betsTypeW) => {
                expect(betsTypeW.length).to.equal(1);
                expect(betsTypeW[0]).to.equal(bet);
            });
    });

    it('should be able to apply a bet to the race even if commission object does not conatin bet type', () => {
        var race = new Race('Apply 1 bet', '2017-07-24', {'P': '0.12', 'E': '0.18'});
        var createBet = Promise.promisify(Bet.create);
        race.promisifiedApplyBet = Promise.promisify(race.applyBet);
        race.promisifiedBetsOfType = Promise.promisify(race.betsOfType);
        var bet;
        return createBet('W', '2', '3')
            .then((newBet) => {
                bet = newBet;
                return race.promisifiedApplyBet(newBet);
            }).then(() => {
                return race.promisifiedBetsOfType('W');
            }).then((betsTypeW) => {
                expect(betsTypeW.length).to.equal(1);
                expect(betsTypeW[0]).to.equal(bet);
            });
    });

    it('should be able to apply multiple bets to the race', () => {
        var race = new Race('Apply multiple bets', '2017-07-24', TestCommissions);
        var createBet = Promise.promisify(Bet.create);
        race.promisifiedApplyBet = Promise.promisify(race.applyBet);
        race.promisifiedBetsOfType = Promise.promisify(race.betsOfType);
        var betW;
        var betP;
        return createBet('W', '2', '3')
            .then((newBet) => {
                betW = newBet;
                return race.promisifiedApplyBet(newBet);
            }).then(() => {
                return race.promisifiedBetsOfType('W');
            }).then((betsTypeW) => {
                expect(betsTypeW.length).to.equal(1);
                expect(betsTypeW[0]).to.equal(betW);
                return createBet('P', '1', '4');
            }).then((newBet) => {
                betP = newBet;
                return race.promisifiedApplyBet(newBet);
            }).then(() => {
                return race.promisifiedBetsOfType('W');
            }).then((betsTypeW) => {
                expect(betsTypeW.length).to.equal(1);
                return race.promisifiedBetsOfType('P');
            }).then((betsTypeP) => {
                expect(betsTypeP.length).to.equal(1);
                expect(betsTypeP[0]).to.equal(betP);
            });
    });

    it('should be able to conclude the race', () => {
        var race = new Race('Conclude race', '2017-07-24', TestCommissions);
        var createBet = Promise.promisify(Bet.create);
        var result = new RaceResult(['1', '2', '3']);
        race.promisifiedApplyBet = Promise.promisify(race.applyBet);
        race.promisifiedConclude = Promise.promisify(race.conclude);
        return createBet('W', '2', '3')
            .then((newBet) => {
                return race.promisifiedApplyBet(newBet);
            }).then(() => {
                return race.promisifiedConclude(result);
            }).then(() => {
                expect(race.result).to.equal(result);
            });
    });

    it('should not be able to conclude the race more than once', () => {
        var race = new Race('Conclude more than once', '2017-07-24', TestCommissions);
        var createBet = Promise.promisify(Bet.create);
        var result = new RaceResult(['1', '2', '3']);
        race.promisifiedApplyBet = Promise.promisify(race.applyBet);
        race.promisifiedConclude = Promise.promisify(race.conclude);
        return createBet('W', '2', '3')
            .then((newBet) => {
                return race.promisifiedApplyBet(newBet);
            }).then(() => {
                return race.promisifiedConclude(result);
            }).then(() => {
                expect(race.result).to.equal(result);
                return race.promisifiedConclude(new RaceResult(['3', '2', '1']))
                    .then(() => {
                        throw new Error('It should not be here');
                    }).catch((e) => {
                        expect(e.message).to.equal('Race already concluded');
                    });
            });
    });

    it('should not be able to apply bet on concluded race', () => {
        var race = new Race('Conclude and bet', '2017-07-24', TestCommissions);
        var createBet = Promise.promisify(Bet.create);
        var result = new RaceResult(['1', '2', '3']);
        race.promisifiedApplyBet = Promise.promisify(race.applyBet);
        race.promisifiedConclude = Promise.promisify(race.conclude);
        return createBet('W', '2', '3')
            .then((newBet) => {
                return race.promisifiedApplyBet(newBet);
            }).then(() => {
                return race.promisifiedConclude(result);
            }).then(() => {
                expect(race.result).to.equal(result);
                return createBet('P', '1', '3');
            }).then((newBet) => {
                return race.promisifiedApplyBet(newBet)
                    .then(() => {
                        throw new Error('It should not be here');
                    }).catch((e) => {
                        expect(e.message).to.equal('Race already concluded');
                    });
            });
    });
});