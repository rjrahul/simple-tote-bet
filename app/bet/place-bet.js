'use strict';

var Bet = require('./index');
var util = require('util');

/**
 * A class to handle Place bets
 * 
 * @param {string} selections 
 * @param {string} stake 
 * @throws Throws an Error if invalid data
 */
function PlaceBet(selections, stake) {
    validate(selections);
    PlaceBet.super_.call(this, 'P', selections.trim(), 1 * stake.trim());
}

/**
 * Place Bet is placed when a selection for first, second or third position
 * is specified.
 * 
 * @param {string} selections - Selections should be whole number
 * @param {string} stake - Stakes for the bet
 * @throws Throws an Error if invalid data
 */
function validate(selections) {
    if(!/[1-9][0-9]*/.test(selections)) {
        throw new Error('Place bet selection must be single whole number');
    }
}

util.inherits(PlaceBet, Bet);

module.exports = PlaceBet;