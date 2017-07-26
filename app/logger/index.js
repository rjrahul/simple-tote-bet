'use strict';

/**
 * A basic logger function for printing to console.
 * @constructor
 */
function Logger() {}

/**
 * A method to log the message
 * @param {string} message - Message to be logged
 */
Logger.prototype.log = (message) => {
    console.log(message);
};

module.exports = Logger;