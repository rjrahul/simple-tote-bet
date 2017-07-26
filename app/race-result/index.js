'use strict';

var _ = require('lodash');
var uuidv4 = require('uuid/v4');

/**
 * A class to store race results
 * 
 * @constructor
 * @param {string[]} results - Results of the race in ordered fashion 
 *                              with 0th index denoting first position
 * @throws Throws an exception if data is invalid
 */
function RaceResult(results) {
    validate(results);
    this.results = results;
    this.id = uuidv4();
}

/**
 * Validates that race result is an unique array of minimum 3 whole numbers
 * 
 * @param {string[]} results - Race results to validate
 * @throws Throws an exception if invalid
 */
function validate(results) {
    if(!Array.isArray(results)) {
        throw new Error('Results are mandatory to be an array of whole numbers');
    }
    var wholeNumTest = results.every((result) => {
        return /[1-9][0-9]*/.test(result);
    });
    if(!wholeNumTest) {
        throw new Error('Results are mandatory to be an array of whole numbers');
    }
    if(results.length < 3) {
        throw new Error('Minimum 3 positions should be specified');
    }
    var uniqSet = _.uniqBy(results, _.trim);
    if(results.length != uniqSet.length) {
        throw new Error('Results should be uniquely positioned runners');
    }
}

/**
 * @returns {string} Returns the runner of first position
 */
RaceResult.prototype.getFirstPosition = function() {
    return this.results[0];
};

/**
 * @returns {string} Returns the runner of second position
 */
RaceResult.prototype.getSecondPosition = function() {
    return this.results[1];
};

/**
 * @returns {string} Returns the runner of third position
 */
RaceResult.prototype.getThirdPosition = function() {
    return this.results[2];
};

module.exports = RaceResult;