'use strict';

var _ = require('lodash');
var validate = require('../../app/dividend-calculator/validator');

describe('Dividend validator', () => {
    it('should validate that race result is mandatory', (done) => {
        validate((err) => {
            expect(err.message).to.equal('RaceResult is mandatory');
            done();
        });
    });
});