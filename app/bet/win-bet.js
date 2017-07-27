'use strict';

var Bet = require('./index');
var util = require('util');

/**
 * A class to handle Win bets
 * 
 * @constructor
 * @param {string} selections 
 * @param {string} stake 
 */
function WinBet(selections, stake) {
    WinBet.super_.call(this, 'W', selections.trim(), 1 * stake.trim());
}

util.inherits(WinBet, Bet);

module.exports = WinBet;