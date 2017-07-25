'use strict'

var Logger = require('../../app/logger');
var TestString = '    ✓';  // nice hack to keep the mocha report clean. LOL.

describe('Logger', () => {
    it('should log a message to the console', () => {
        var sut = new Logger();
        var spy = sinon.spy(console, 'log');

        sut.log(TestString);

        expect(spy.calledOnce);
        expect(spy.calledWithMatch(TestString));

        spy.restore();
    });
});