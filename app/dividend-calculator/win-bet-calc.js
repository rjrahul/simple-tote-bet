'use strict';

var _ = require('lodash');

/**
 * This method calculates dividend for Win bets based on RaceResult.
 * 
 * @param {RaceResult} result - Result of the race
 * @param {WinBet[]} bets - Array of Win Bets
 * @param {string} commission - Commission as a string
 * @param {function} cb - Callback function
 */
function calculateDividend(result, bets, commission, cb) {
    if(typeof result === 'function') {
        cb = result;
        result = null;
    }
    if(typeof bets === 'function') {
        cb = bets;
        bets = null;
    }
    if(typeof commission === 'function') {
        cb = commission;
        commission = '0';
    }
    validate(result, bets, (err) => {
        if(err) {
            return cb(err);
        }
        
        var winPool = calculateWinPool(result, bets);
        var commissionedPool = winPool * (1 - commission);

        cb(null, determineDividend(result, commissionedPool, bets));
    });
}

/**
 * It validates the parameters
 * @param {RaceResult} result - RaceResult object
 * @param {WinBet[]} bets - Array of Win bets
 * @param {function} cb - Callback function
 * @throws Throws an Error if data is invalid
 */
function validate(result, bets, cb) {
    if(!result) {
        return cb(new Error('RaceResult is mandatory'));
    }
    if(!bets || !Array.isArray(bets) || !bets.length) {
        return cb(new Error('Bets should be an array of minimum 1 WinBet'));
    }
    cb();
}

/**
 * This method determines if the Win Bet has been won or not based on RaceResult.
 * 
 * @param {RaceResult} result - RaceResult
 * @param {WinBet} bet - An WinBet object
 * @returns {boolean} Whether a bet is won or lost
 */
function isBetWon(result, bet) {
    return result.getFirstPosition() === bet.selections;
}

/**
 * This method determines the win pool total for Win bets
 * @param {RaceResult} result - RaceResult
 * @param {WinBet[]} bets - Array of Win bets
 * @returns {Number} Total dollars in the win pool
 */
function calculateWinPool(result, bets) {
    return bets.reduce((winPool, bet) => {
        return !isBetWon(result, bet) ? winPool + bet.stake : winPool;
    }, 0);
}

/**
 * This method calculates dividend for the Win Bets
 * @param {RaceResult} result - RaceResult
 * @param {string} commissionedPool - Total win pool after deducting commission
 * @param {WinBet[]} bets - Array of Win bets
 * @returns {Number} Returns the dividend value for Win bets
 */
function determineDividend(result, commissionedPool, bets) {
    var totalWinStake = bets.reduce((winStake, bet) => {
        return isBetWon(result, bet) ? winStake + bet.stake : winStake;
    }, 0);

    return _.floor(commissionedPool / (totalWinStake || 1), 2);
}

module.exports.calculateDividend = calculateDividend;