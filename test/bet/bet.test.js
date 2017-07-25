'use strict';

var Bet = require('../../app/bet');
var WinBet = require('../../app/bet/win-bet');
var PlaceBet = require('../../app/bet/place-bet');
var ExactaBet = require('../../app/bet/exacta-bet');

describe('Bets', () => {
    it('should mandate for a bet type', (done) => {
        Bet.create((err) => {
            expect(err.message).to.equal('Product is mandatory');
            done();
        });
    });
    it('should mandate for a bet type even when containing only spaces', (done) => {
        Bet.create(' ', (err) => {
            expect(err.message).to.equal('Product is mandatory');
            done();
        });
    });
    it('should validate bet from 3 types W,P,E', (done) => {
        Bet.create('A', (err) => {
            expect(err.message).to.equal('Invalid product. Use W, P or E.');
            done();
        });
    });
    it('should mandate runner selection', (done) => {
        Bet.create('W', (err) => {
            expect(err.message).to.equal('Selections is mandatory');
            done();
        });
    });
    it('should mandate bet amount', (done) => {
        Bet.create('W', '2', (err) => {
            expect(err.message).to.equal('Stake is mandatory');
            done();
        });
    });
    it('should validate bet amount to be a whole number', (done) => {
        Bet.create('W', '2', 'a', (err) => {
            expect(err.message).to.equal('Stake needs to be a whole number greater than 0');
            done();
        });
    });
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