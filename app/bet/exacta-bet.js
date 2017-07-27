'use strict';

var Bet = require('./index');
var util = require('util');

/**
 * A class to handle exacta bets
 * 
 * @constructor
 * @param {string[]} selections 
 * @param {string} stake 
 */
function ExactaBet(selections, stake) {
    selections = selections.map((s) => { return s.trim(); });
    ExactaBet.super_.call(this, 'E', selections, 1 * stake.trim());
}

util.inherits(ExactaBet, Bet);

module.exports = ExactaBet;