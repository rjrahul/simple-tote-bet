'use strict';

var _ = require('lodash');
var validate = require('./validator');

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
 * This method determines the total bet pool
 * @param {WinBet[]} bets - Array of Win bets
 * @returns {Number} Total dollars in the win pool
 */
function calculateTotalPool(bets) {
    return bets.reduce((totalPool, bet) => {
        return totalPool + bet.stake;
    }, 0);
}

/**
 * This method determines the win stakes total for win bets
 * @param {RaceResult} result - RaceResult
 * @param {WinBet[]} bets - Array of Win bets
 * @returns {Number} Total dollars in the win pool
 */
function calculateWinStakes(result, bets) {
    return bets.reduce((winStakes, bet) => {
        return isBetWon(result, bet) ? winStakes + bet.stake : winStakes;
    }, 0);
}

/**
 * This method calculates dividend for the Win Bets
 * @param {Number} totalPool - Total stakes
 * @param {Number} totalWinStake - Winners stakes
 * @param {string} commission - Commission to deduct from total pool
 * @returns {Number} Returns the dividend value for Win bets
 */
function determineDividend(totalPool, totalWinStake, commission) {
    var commissionedPool = totalPool * (1 - commission);

    return totalWinStake ? _.round(commissionedPool / totalWinStake, 2) : 0;
}

module.exports.calculateDividend = calculateDividend;