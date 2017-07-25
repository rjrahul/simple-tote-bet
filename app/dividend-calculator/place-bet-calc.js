'use strict';

var _ = require('lodash');

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
 * @param {PlaceBet[]} bets - Array of Place bets
 * @param {function} cb - Callback function
 * @throws Throws an Error if data is invalid
 */
function validate(result, bets, cb) {
    if(!result) {
        return cb(new Error('RaceResult is mandatory'));
    }
    if(!bets || !Array.isArray(bets) || !bets.length) {
        return cb(new Error('Bets should be an array of minimum 1 PlaceBet'));
    }
    cb();
}

/**
 * This method determines the win pool total for place bets
 * @param {RaceResult} result - RaceResult
 * @param {PlaceBet[]} bets - Array of Place bets
 * @returns {Number} Total dollars in the win pool
 */
function calculateWinPool(result, bets) {
    return bets.reduce((winPool, bet) => {
        return !isBetWon(result, bet) ? winPool + bet.stake : winPool;
    }, 0);
}

/**
 * This method determines if the Place Bet has been won or not based on RaceResult.
 * A Place bet is won if the selected runner is either in first, second or third place.
 * 
 * @param {RaceResult} result - RaceResult
 * @param {PlaceBet} bet - An PlaceBet object
 * @returns {boolean} Whether a bet is won or lost
 */
function isBetWon(result, bet) {
    return isFirstPositionWin(result, bet)
            || isSecondPositionWin(result, bet)
            || isThirdPositionWin(result, bet);
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
 * For calculating place bet dividend the commissioned pool is divided into 3 equal parts
 * each for first, second and third position and then divided based on applied stakes.
 * 
 * @param {RaceResult} result - RaceResult
 * @param {string} commissionedPool - Total win pool after deducting commission
 * @param {PlaceBet[]} bets - Array of Place bets
 * @returns {Number} Returns the dividend value for Place bets
 */
function determineDividend(result, commissionedPool, bets) {
    var firstPositionStake = bets.reduce((winStake, bet) => {
        return isFirstPositionWin(result, bet) ? winStake + bet.stake : winStake;
    }, 0);

    var secondPositionStake = bets.reduce((winStake, bet) => {
        return isSecondPositionWin(result, bet) ? winStake + bet.stake : winStake;
    }, 0);

    var thirdPositionStake = bets.reduce((winStake, bet) => {
        return isThirdPositionWin(result, bet) ? winStake + bet.stake : winStake;
    }, 0);

    var winPool = commissionedPool / 3;

    return [
        _.floor(winPool / (firstPositionStake || 1), 2), 
        _.floor(winPool / (secondPositionStake || 1), 2), 
        _.floor(winPool / (thirdPositionStake || 1), 2)
    ];
}

module.exports.calculateDividend = calculateDividend;