'use strict';

var uuidv4 = require('uuid/v4');
var _ = require('lodash');
var DividendCalc = require('../dividend-calculator');

/**
 * A class that handles aspects related to race such as it's creation
 * and dividends calculation.
 * @Constructor
 * @param {string} name - A rememberable name for the race
 * @param {string} date - Date on which race is to take place
 * @param {Object} commissions - An object containing commission details for bet types
 */
function Race(name, date, commissions) {
    this.name = name;
    this.date = date;
    this.commissions = commissions;
    this.id = uuidv4();
    this.concluded = false;

    this.betPool = _.transform(commissions, (r, v, k) => {
        r[k] = [];
    }, {});
}

/**
 * This method applied a bet to this race if it is not already concluded.
 * @param {Bet} bet - A bet to be applied to the race
 * @param {function} cb - Callback function
 */
Race.prototype.applyBet = function(bet, cb) {
    if(this.concluded) {
        return cb(new Error('Race already concluded'));
    }
    this.betPool[bet.product].push(bet);
    cb();
};

/**
 * This method returns the bet pool for the type of bet passed as input.
 * @param {string} betType - Type of bet for which bet pool is to be retrieved
 * @param {function} cb - Callback function
 */
Race.prototype.betsOfType = function(betType, cb) {
    cb(null, this.betPool[betType]);
};

/**
 * This method concludes the race based on the race result.
 * @param {RaceResult} raceResult - Result of this race
 * @param {function} cb - Callback function
 */
Race.prototype.conclude = function(raceResult, cb) {
    if(this.concluded) {
        return cb(new Error('Race already concluded'));
    }
    this.result = raceResult;
    this.concluded = true;
    cb();
};

/**
 * This method calculates the dividends for each type of bet and returns an
 * object containing bet type vs. winner and its dividend mappings.
 * 
 * Sample returned object:
 * {
 *   'W': {
 *     'runner': '1',
 *     'dividend': 1.26
 *   },
 *   'P': [
 *     {
 *       'runner': '1',
 *       'dividend': 1.02
 *     },
 *     {
 *       'runner': '2',
 *       'dividend': 1.34
 *     },
 *     {
 *       'runner': '3',
 *       'dividend': 2.16
 *     }
 *   ],
 *   'E': {
 *     'runner': '1,2',
 *     'dividend': 3.09
 *   }
 * }
 * 
 * @param {function} cb - Callback function
 */
Race.prototype.calculateDividends = function(cb) {
    if(!this.concluded) {
        return cb(new Error('Race not yet concluded'));
    }

    DividendCalc.calculateDividend(this, (err, dividends) => {
        if(err) {
            return cb(err);
        }
        var finalDividends = _.transform(dividends, (obj, dividend, betType) => {
            switch(betType) {
                case 'W':
                    obj.W = {
                        'runner': this.result.getFirstPosition(),
                        'dividend': dividend
                    }
                    break;
                case 'P':
                    obj.P = [{
                        'runner': this.result.getFirstPosition(),
                        'dividend': dividend[0]
                    }, {
                        'runner': this.result.getSecondPosition(),
                        'dividend': dividend[1]
                    }, {
                        'runner': this.result.getThirdPosition(),
                        'dividend': dividend[2]
                    }]
                    break;
                case 'E':
                    obj.E = {
                        'runner': this.result.getFirstPosition() + ',' + this.result.getSecondPosition(),
                        'dividend': dividend
                    }
                    break;
            }

            return obj;
        }, {});

        cb(null, finalDividends);
    });
};

module.exports = Race;