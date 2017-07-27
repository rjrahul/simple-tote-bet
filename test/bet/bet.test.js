'use strict';

var Bet = require('../../app/bet');
var WinBet = require('../../app/bet/win-bet');
var PlaceBet = require('../../app/bet/place-bet');
var ExactaBet = require('../../app/bet/exacta-bet');

describe('Bets', () => {
    it('should create a bet of type Win', (done) => {
        Bet.create('W', '2', '3', (err, bet) => {
            expect(err).to.be.not.ok;
            expect(bet).to.be.instanceof(WinBet);
            expect(bet.id).to.be.ok;
            done();
        });
    });
    it('should create a bet of type Place', (done) => {
        Bet.create('P', '2', '3', (err, bet) => {
            expect(err).to.be.not.ok;
            expect(bet).to.be.instanceof(PlaceBet);
            expect(bet.id).to.be.ok;
            done();
        });
    });
    it('should create a bet of type Exacta', (done) => {
        Bet.create('E', ['2', '3'], '4', (err, bet) => {
            expect(err).to.be.not.ok;
            expect(bet).to.be.instanceof(ExactaBet);
            expect(bet.id).to.be.ok;
            done();
        });
    });
});