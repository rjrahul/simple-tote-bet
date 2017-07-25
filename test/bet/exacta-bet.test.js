'use strict';

var Bet = require('../../app/bet');

describe('ExactaBet', () => {
    it('should validate runner selection to be an array for exacta bet', (done) => {
        Bet.create('E', 'a', '1', (err) => {
            expect(err.message).to.equal('Exacta bet selections must be for first and second position');
            done();
        });
    });
    it('should validate runner selection to be an array of whole numbers for exacta bet', (done) => {
        Bet.create('E', ['a', '1'], '1', (err) => {
            expect(err.message).to.equal('Exacta bet selections must be whole numbers');
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