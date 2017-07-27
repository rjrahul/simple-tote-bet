'use strict';

/**
 * Performs basic validations on the product, selections and stake params
 * @param {string} product - Product type of bet should be W, P or E
 * @param {string|string[]} selections - Selections of runners for the bet
 * @param {string} stake - Stake for the bet
 * @param {function} cb - Callback that will receive the error, if failed.
 */
function validate(product, selections, stake, cb) {
    if(!product || (product.trim && !product.trim())) {
        return cb(new Error('Product is mandatory'));
    }
    if(['W', 'P', 'E'].indexOf(product.trim()) < 0) {
        return cb(new Error('Invalid product. Use W, P or E.'));
    }
    if(!selections || (selections.trim && !selections.trim())) {
        return cb(new Error('Selections is mandatory'));
    }
    if(product.trim() === 'E' && (!Array.isArray(selections) || selections.length !== 2)) {
        return cb(new Error('Exacta bet selections must be for first and second position'));
    }
    
    var selectionsArr = Array.isArray(selections) ? selections: [selections];
    if(!isWholeNumber(selectionsArr)) {
        return cb(new Error('Selections must be whole numbers'));
    }

    if(!stake || (stake.trim && !stake.trim())) {
        return cb(new Error('Stake is mandatory'));
    }
    if(!isWholeNumber([stake])) {
        return cb(new Error('Stake needs to be a whole number greater than 0'));
    }
    cb();
}

/**
 * This method tests every element of an array to be a whole number and returns
 * false if any of the number fails the test.
 * @param {string[]} input - Array of strings that need to be tested for whole numbers.
 */
function isWholeNumber(input) {
    return input.every((inp) => {
        return /[1-9][0-9]*/.test(inp);
    });
}

module.exports = validate;