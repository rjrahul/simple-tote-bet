'use strict';

var _ = require('lodash');
var validate = require('./validator');

/**
 * This method calculates dividend for Place bets based on RaceResult.
 * 
 * @param {RaceResult} result - Result of the race
 * @param {PlaceBet[]} bets - Array of Place Bets
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
            return cb(null, [0, 0, 0]);
        }

        var totalPool = calculateTotalPool(bets);
        var firstPositionStakes = calculateFirstPositionStakes(result, bets);
        var secondPositionStakes = calculateSecondPositionStakes(result, bets);
        var thirdPositionStakes = calculateThirdPositionStakes(result, bets);

        cb(null, determineDividend(totalPool, firstPositionStakes, secondPositionStakes, thirdPositionStakes, commission));
    });
}

/**
 * This method determines the total bet pool
 * @param {PlaceBet[]} bets - Array of Place bets
 * @returns {Number} Total dollars in the win pool
 */
function calculateTotalPool(bets) {
    return bets.reduce((totalPool, bet) => {
        return totalPool + bet.stake;
    }, 0);
}

/**
 * This method determines the win stakes for first position runner winners
 * @param {RaceResult} result - RaceResult
 * @param {PlaceBet[]} bets - Array of Place bets
 * @returns {Number} Total dollars in the win pool
 */
function calculateFirstPositionStakes(result, bets) {
    return bets.reduce((winStake, bet) => {
        return isFirstPositionWin(result, bet) ? winStake + bet.stake : winStake;
    }, 0);
}

/**
 * This method determines the win stakes for second position runner winners
 * @param {RaceResult} result - RaceResult
 * @param {PlaceBet[]} bets - Array of Place bets
 * @returns {Number} Total dollars in the win pool
 */
function calculateSecondPositionStakes(result, bets) {
    return bets.reduce((winStake, bet) => {
        return isSecondPositionWin(result, bet) ? winStake + bet.stake : winStake;
    }, 0);
}

/**
 * This method determines the win stakes for third position runner winners
 * @param {RaceResult} result - RaceResult
 * @param {PlaceBet[]} bets - Array of Place bets
 * @returns {Number} Total dollars in the win pool
 */
function calculateThirdPositionStakes(result, bets) {
    return bets.reduce((winStake, bet) => {
        return isThirdPositionWin(result, bet) ? winStake + bet.stake : winStake;
    }, 0);
}

/**
 * This method determines if the Place Bet has been won for first place.
 * 
 * @param {RaceResult} result - RaceResult
 * @param {PlaceBet} bet - An PlaceBet object
 * @returns {boolean} Whether a bet is won or lost
 */
function isFirstPositionWin(result, bet) {
    return result.getFirstPosition() === bet.selections; 
}

/**
 * This method determines if the Place Bet has been won for second place.
 * 
 * @param {RaceResult} result - RaceResult
 * @param {PlaceBet} bet - An PlaceBet object
 * @returns {boolean} Whether a bet is won or lost
 */
function isSecondPositionWin(result, bet) {
    return result.getSecondPosition() === bet.selections;
}

/**
 * This method determines if the Place Bet has been won for third place.
 * 
 * @param {RaceResult} result - RaceResult
 * @param {PlaceBet} bet - An PlaceBet object
 * @returns {boolean} Whether a bet is won or lost
 */
function isThirdPositionWin(result, bet) {
    return result.getThirdPosition() === bet.selections;
}

/**
 * This method calculates dividend for the Place Bets.
 * For calculating place bet dividend, the commissioned pool is divided into 3 equal parts
 * each for first, second and third position and then divided based on applied stakes.
 * 
 * @param {Number} totalPool - Total stakes
 * @param {Number} firstPositionWinStake - Winners stakes who won for first position runner
 * @param {Number} secondPositionWinStake - Winners stakes who won for second position runner
 * @param {Number} thirdPositionWinStake - Winners stakes who won for third position runner
 * @param {string} commission - Commission to deduct from total pool
 * @returns {Number} Returns the dividend value for Place bets
 */
function determineDividend(totalPool, firstPositionWinStake, secondPositionWinStake, thirdPositionWinStake, commission) {
    var commissionedPool = totalPool * (1 - commission);

    var winPool = commissionedPool / 3;

    return [
        firstPositionWinStake ? _.round(winPool / firstPositionWinStake, 2) : 0, 
        secondPositionWinStake ? _.round(winPool / secondPositionWinStake, 2) : 0, 
        thirdPositionWinStake ? _.round(winPool / thirdPositionWinStake, 2) : 0
    ];
}

module.exports.calculateDividend = calculateDividend;