'use strict';

var uuidv4 = require('uuid/v4');

/**
 * A class to handle various types of bets.
 * 
 * This class exposes a create method (a factory method) to create a bet
 * based on its type while still being the actual Bet object for inherited
 * classes.
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
    Bet.validate(product, selections, stake, (err) => {
        if(err) {
            return cb(err);
        }
        try {
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
        } catch(e) {
            cb(e);
        }
    });
};

/**
 * Performs basic validations on the product, selections and stake params
 * @param {string} product - Product type of bet should be W, P or E
 * @param {string|string[]} selections - Selections of runners for the bet
 * @param {string} stake - Stake for the bet
 * @param {function} cb - Callback that will receive the error, if failed.
 */
Bet.validate = (product, selections, stake, cb) => {
    if(!product || (product.trim && !product.trim())) {
        return cb(new Error('Product is mandatory'));
    }
    if(['W', 'P', 'E'].indexOf(product.trim()) < 0) {
        return cb(new Error('Invalid product. Use W, P or E.'));
    }
    if(!selections || (selections.trim && !selections.trim())) {
        return cb(new Error('Selections is mandatory'));
    }
    if(!stake || (stake.trim && !stake.trim())) {
        return cb(new Error('Stake is mandatory'));
    }
    if(!/[1-9][0-9]*/.test(stake)) {
        return cb(new Error('Stake needs to be a whole number greater than 0'));
    }
    cb();
};

module.exports = Bet;