'use strict';

var readline = require('readline');
var util = require("util");
var events = require("events");
var Promise = require('bluebird');
var Race = require('../app/race');
var Bet = require('../app/bet');
var RaceResult = require('../app/race-result');

function CLI() {
    events.EventEmitter.call(this);
}

util.inherits(CLI, events.EventEmitter);

CLI.prototype.start = function() {
    var self = this;
    var race = new Race('Game on!!!', (new Date()).toString(), {'W': '0.15', 'P': '0.12', 'E': '0.18'});
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    var introText = 'Welcome to simple Tote Betting game!!!' + 
                    '\n\nRace has already started. Please use following formats to place your bets' +
                    '\n\tBet:<product>:<selections>:<stake>' +
                    '\n\t\t<product> is one of W, P, E' +
                    '\n\t\t<selections> is either a single runner number (e.g. 4 ) for Win and Place, or two runner numbers (e.g. 4,3 ) for Exacta' +
                    '\n\t\t<stake> is an amount in whole dollars (e.g. 35 )' +
                    '\n\nAt the end enter race result in following format' +
                    '\n\tResult:<first>:<second>:<third>\n';

    rl.write(introText);

    var listener = function(answer) {
        self.validateFormat(answer, (err) => {
            if(err) {
                self.emit('error', err.message);
            } else if(answer.startsWith('Bet')) {
                self.emit('apply-bet', answer);
            } else if(answer.startsWith('Result')) {
                self.emit('conclude', answer);
            }
        });
    };

    this.on('error', (msg) => {
        rl.write(msg + '\n');
        rl.question('\n> ', listener);
    });

    this.on('apply-bet', (bet) => {
        self.parseAndCreateBet(bet, (err, betObj) => {
            if(err) {
                self.emit('error', err.message);
                return;
            }
            race.applyBet(betObj, (err) => {
                if(err) {
                    self.emit('error', err.message);
                    return;
                }
                rl.write('Your bet is placed with id ' + betObj.id + '\n');
                rl.question('\n> ', listener);
            });
        });
    });

    this.once('conclude', (result) => {
        Promise.promisify(self.parseAndConclude, {context: self})(result)
            .then((raceResult) => {
                return Promise.promisify(race.conclude, {context: race})(raceResult);
            }).then(() => {
                rl.write('Race concluded \nCalculating dividends...\n');
                return Promise.promisify(race.calculateDividends, {context: race})();
            }).then((dividends) => {
                var formattedDividends = self.formatDividendOutput(dividends);
                rl.write('Dividends are\n');
                rl.write(formattedDividends);
            }).catch((e) => {
                self.emit('error', err.message);
                return;
            }).finally(() => {
                rl.close();
                self.emit('end');
            });
    });

    rl.question('\n> ', listener);
    self.emit('started');
};

CLI.prototype.validateFormat = function(answer, cb) {
    if(!answer.startsWith('Bet') && !answer.startsWith('Result') && answer.split(':').length !== 4) {
        return cb(new Error('Invalid input. Please specify either a Bet or Result.'));
    }
    cb();
};

CLI.prototype.parseAndCreateBet = function(bet, cb) {
    var betParts = bet.split(':');
    if(betParts[1] === 'E') {
        betParts[2] = [betParts[2].split(',')[0], betParts[2].split(',')[1]];
    }
    Bet.create(betParts[1], betParts[2], betParts[3], cb);
};

CLI.prototype.parseAndConclude = function(result, cb) {
    var resultParts = result.split(':');
    cb(null, new RaceResult([resultParts[1], resultParts[2], resultParts[3]]));
};

CLI.prototype.formatDividendOutput = function(dividends) {
    var output = '';
    output += 'W:' + dividends.W.runner + ':$' + dividends.W.dividend + '\n';
    output += 'P:' + dividends.P[0].runner + ':$' + dividends.P[0].dividend + '\n';
    output += 'P:' + dividends.P[1].runner + ':$' + dividends.P[1].dividend + '\n';
    output += 'P:' + dividends.P[2].runner + ':$' + dividends.P[2].dividend + '\n';
    output += 'E:' + dividends.E.runner + ':$' + dividends.E.dividend + '\n';
    return output;
};

module.exports = CLI;