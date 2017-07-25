'use strict';

var Bet = require('./index');
var util = require('util');

/**
 * A class to handle exacta bets
 * 
 * @param {string[]} selections 
 * @param {string} stake 
 * @throws Throws an error if invalid data
 */
function ExactaBet(selections, stake) {
    validate(selections);
    selections = selections.map((s) => { return s.trim(); });
    ExactaBet.super_.call(this, 'E', selections, 1 * stake.trim());
}

/**
 * Exacta Bet is placed when a selection for first and second position in correct
 * order is specified.
 * 
 * @param {string[]} selections - Selections should be array of length 2
 * @param {string} stake - Stakes for the bet
 * @throws Throws an Error if invalid data
 */
function validate(selections) {
    if(!Array.isArray(selections) || selections.length !== 2) {
        throw new Error('Exacta bet selections must be for first and second position');
    }
    var wholeNumTest = selections.every((sel) => {
        return /[1-9][0-9]*/.test(sel);
    });
    if(!wholeNumTest) {
        throw new Error('Exacta bet selections must be whole numbers');
    }
}

util.inherits(ExactaBet, Bet);

module.exports = ExactaBet;