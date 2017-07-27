'use strict';

/**
 * It validates the parameters. Currently, only validation done is for Race result to be mandatory
 * @param {RaceResult} result - RaceResult object
 * @param {function} cb - Callback function
 */
function validate(result, cb) {
    if(typeof result === 'function') {
        cb = result;
        result = null;
    }
    if(!result) {
        return cb(new Error('RaceResult is mandatory'));
    }
    cb();
}

module.exports = validate;