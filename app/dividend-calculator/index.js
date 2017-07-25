'use strict';

var _ = require('lodash');
var ExactaBetCalc = require('./exacta-bet-calc');
var PlaceBetCalc = require('./place-bet-calc');
var WinBetCalc = require('./win-bet-calc');
var Promise = require('bluebird');

/**
 * This method calculates dividends for each type of bets and returns an object denoting
 * the dividend values.
 * 
 * If successful, it returns an object with key as bet type and value as dividend
 * 
 * @param {Race} race - An object of concluded race
 * @param {function} cb - A callback function
 */
function calculateDividend(race, cb) {
    if(typeof race === 'function') {
        cb = race;
        race = null;
    }
    if(!race || !race.concluded) {
        return cb(new Error('Concluded race is mandatory for calculating dividends'));
    }

    var betTypes = _.keys(race.commissions);
    var dividends = {};

    Promise.each(betTypes, (betType) => {
        return Promise.promisify(race.betsOfType, {context: race})(betType)
                .then((bets) => {
                    switch(betType) {
                        case 'W':
                            return Promise.promisify(WinBetCalc.calculateDividend)(race.result, bets, race.commissions[betType]);
                        case 'P':
                            return Promise.promisify(PlaceBetCalc.calculateDividend)(race.result, bets, race.commissions[betType]);
                        case 'E':
                            return Promise.promisify(ExactaBetCalc.calculateDividend)(race.result, bets, race.commissions[betType]);
                    }
                }).then((dividend) => {
                    dividends[betType] = dividend;
                });
    }).then(() => {
        cb(null, dividends);
    }).catch((e) => {
        cb(e);
    });
}

module.exports.calculateDividend = calculateDividend;