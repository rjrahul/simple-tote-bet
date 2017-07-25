'use strict';

var RaceResult = require('../../app/race-result');

describe('Race results', () => {
    it('should be able to mandate results', () => {
        expect(() => { new RaceResult(); }).to.throw('Results are mandatory to be an array of whole numbers');
    });
    it('should be able to validate results is an array', () => {
        expect(() => { new RaceResult('1'); }).to.throw('Results are mandatory to be an array of whole numbers');
    });
    it('should be able to validate all results are whole numbers', () => {
        expect(() => { new RaceResult(['1', 'a']); }).to.throw('Results are mandatory to be an array of whole numbers');
    });
    it('should be able to validate all results are unique', () => {
        expect(() => { new RaceResult(['1', '1', '2']); }).to.throw('Results should be uniquely positioned runners');
    });
    it('should be able to validate min 3 positions are specified', () => {
        expect(() => { new RaceResult(['1', '2']); }).to.throw('Minimum 3 positions should be specified');
    });
    it('should be able to create a race result', () => {
        var result = new RaceResult(['1', '2', '3']);
        expect(result.getFirstPosition()).to.equal('1');
        expect(result.getSecondPosition()).to.equal('2');
        expect(result.getThirdPosition()).to.equal('3');
    });
});