'use strict';

var _ = require('lodash');

/**
 * This method calculates dividend for Exacta bets based on RaceResult.
 * 
 * @param {RaceResult} result - Result of the race
 * @param {ExactaBet[]} bets - Array of Exacta Bets
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
    validate(result, (err) => {
        if(err) {
            return cb(err);
        }
        
        if(!bets || !Array.isArray(bets) || !bets.length) {
            return cb(null, 0);
        }
        
        var totalPool = calculateTotalPool(bets);
        var winStakes = calculateWinStakes(result, bets);

        cb(null, determineDividend(totalPool, winStakes, commission));
    });
}

/**
 * It validates the parameters
 * @param {RaceResult} result - RaceResult object
 * @param {function} cb - Callback function
 * @throws Throws an Error if data is invalid
 */
function validate(result, cb) {
    if(!result) {
        return cb(new Error('RaceResult is mandatory'));
    }
    cb();
}

/**
 * This method determines if the Exacta Bet has been won or not based on RaceResult.
 * 
 * @param {RaceResult} result - RaceResult
 * @param {ExactaBet} bet - An ExactaBet object
 * @returns {boolean} Whether a bet is won or lost
 */
function isBetWon(result, bet) {
    return (result.getFirstPosition() + ',' + result.getSecondPosition()) === bet.selections.join();
}

/**
 * This method determines the win stakes total for exacta bets
 * @param {RaceResult} result - RaceResult
 * @param {ExactaBet[]} bets - Array of Exacta bets
 * @returns {Number} Total dollars in the win pool
 */
function calculateWinStakes(result, bets) {
    return bets.reduce((winStakes, bet) => {
        return isBetWon(result, bet) ? winStakes + bet.stake : winStakes;
    }, 0);
}

/**
 * This method determines the total bet pool
 * @param {ExactaBet[]} bets - Array of Exacta bets
 * @returns {Number} Total dollars in the win pool
 */
function calculateTotalPool(bets) {
    return bets.reduce((totalPool, bet) => {
        return totalPool + bet.stake;
    }, 0);
}

/**
 * This method calculates dividend for the Exacta Bets
 * @param {Number} totalPool - Total stakes
 * @param {Number} totalWinStake - Winners stakes
 * @param {string} commission - Commission to deduct from total pool
 * @returns {Number} Returns the dividend value for exacta bets
 */
function determineDividend(totalPool, totalWinStake, commission) {
    var commissionedPool = totalPool * (1 - commission);

    return totalWinStake ? _.round(commissionedPool / totalWinStake, 2) : 0;
}

module.exports.calculateDividend = calculateDividend;