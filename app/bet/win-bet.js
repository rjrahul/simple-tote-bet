'use strict';

var Bet = require('./index');
var util = require('util');

/**
 * A class to handle Win bets
 * 
 * @param {string} selections 
 * @param {string} stake 
 * @throws Throws an Error if invalid data
 */
function WinBet(selections, stake) {
    validate(selections);
    WinBet.super_.call(this, 'W', selections.trim(), 1 * stake.trim());
}

/**
 * Win Bet is placed when a selection for first position
 * is specified.
 * 
 * @param {string} selections - Selections should be whole number 
 * @param {string} stake - Stakes for the bet
 * @throws Throws an Error if invalid data
 */
function validate(selections) {
    if(!/[1-9][0-9]*/.test(selections)) {
        throw new Error('Win bet selection must be single whole number');
    }
}

util.inherits(WinBet, Bet);

module.exports = WinBet;