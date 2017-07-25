'use strict';

var Bet = require('../../app/bet');

describe('PlaceBet', () => {
    it('should validate runner selection to be a whole number for place bet', (done) => {
        Bet.create('P', 'a', '1', (err) => {
            expect(err.message).to.equal('Place bet selection must be single whole number');
            done();
        });
    });
});