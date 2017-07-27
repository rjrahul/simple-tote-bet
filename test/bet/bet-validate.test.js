'use strict';

var Bet = require('../../app/bet');

describe('Bet validations', () => {
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
    it('should validate runner selection to be a whole number for place bet', (done) => {
        Bet.create('P', 'a', '1', (err) => {
            expect(err.message).to.equal('Selections must be whole numbers');
            done();
        });
    });
    it('should validate runner selection to be a whole number for wind bet', (done) => {
        Bet.create('W', 'a', '1', (err) => {
            expect(err.message).to.equal('Selections must be whole numbers');
            done();
        });
    });

    describe('ExactaBet validations', () => {
        it('should validate runner selection to be an array for exacta bet', (done) => {
            Bet.create('E', 'a', '1', (err) => {
                expect(err.message).to.equal('Exacta bet selections must be for first and second position');
                done();
            });
        });
        it('should validate runner selection to be an array of whole numbers for exacta bet', (done) => {
            Bet.create('E', ['a', '1'], '1', (err) => {
                expect(err.message).to.equal('Selections must be whole numbers');
                done();
            });
        });
        it('should validate runner selection to be an array of 2 whole numbers for exacta bet', (done) => {
            Bet.create('E', ['1'], '1', (err) => {
                expect(err.message).to.equal('Exacta bet selections must be for first and second position');
                done();
            });
        });
    });
});