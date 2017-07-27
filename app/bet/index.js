'use strict';

var uuidv4 = require('uuid/v4');
var validate = require('./validator');

/**
 * A class to handle various types of bets.
 * 
 * This class exposes a create method (a factory method) to create a bet
 * based on its type while still being the actual Bet object for inherited
 * classes.
 * @constructor
 * @param {string} product - Product type of bet W, P or E
 * @param {string|string[]} selections - Selections of runners for the bet
 * @param {string} stake - Stake for the bet
 */
function Bet(product, selections, stake) {
    this.product = product;
    this.selections = selections;
    this.stake = stake;
    this.id = uuidv4();
}

/**
 * A factory method to create bet based on type of product
 * @param {string} product - Product type of bet W, P or E
 * @param {string|string[]} selections - Selections of runners for the bet
 * @param {string} stake - Stake for the bet
 * @param {function} cb - Callback that will receive the bet object if successful
 */
Bet.create = (product, selections, stake, cb) => {
    if(typeof product === 'function') {
        cb = product;
        product = null;
        selections = null;
        stake = null;
    }
    if(typeof selections === 'function') {
        cb = selections;
        selections = '';
        stake = '';
    }
    if(typeof stake === 'function') {
        cb = stake;
        stake = '';
    }
    validate(product, selections, stake, (err) => {
        if(err) {
            return cb(err);
        }
        switch(product.trim()) {
            // require needs to be within the bounds of the method so that all the classes are defined
            case 'W':
                var WinBet = require('./win-bet');
                cb(null, new WinBet(selections, stake));
                break;
            case 'P':
                var PlaceBet = require('./place-bet');
                cb(null, new PlaceBet(selections, stake));
                break;
            case 'E':
                var ExactaBet = require('./exacta-bet');
                cb(null, new ExactaBet(selections, stake));
                break;
        }
    });
};

module.exports = Bet;