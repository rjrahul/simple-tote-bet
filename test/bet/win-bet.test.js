'use strict';

var Bet = require('../../app/bet');
var WinBet = require('../../app/bet/win-bet');
var util = require('util');
var RaceResult = require('../../app/race-result')

describe('WinBet', () => {
    it('should validate runner selection to be a whole number for win bet', (done) => {
        Bet.create('W', 'a', '1', (err) => {
            expect(err.message).to.equal('Win bet selection must be single whole number');
            done();
        });
    });
});