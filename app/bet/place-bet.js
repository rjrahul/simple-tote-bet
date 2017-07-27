'use strict';

var Bet = require('./index');
var util = require('util');

/**
 * A class to handle Place bets
 * 
 * @constructor
 * @param {string} selections 
 * @param {string} stake 
 */
function PlaceBet(selections, stake) {
    PlaceBet.super_.call(this, 'P', selections.trim(), 1 * stake.trim());
}

util.inherits(PlaceBet, Bet);

module.exports = PlaceBet;