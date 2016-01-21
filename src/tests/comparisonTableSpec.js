var ComparisonTable = require('../js/comparisonTable');

describe("preflight test", function(){
    var mockedSheet = [
        { Identifier: 1, Giblets: '', Name: 'Lance', Cost: 711, Date: '2/14/1994' },
        { Identifier: 2, Giblets: 'xli3js9z', Name: 'Sam', Cost: 218, Date: '12/24/2036' },
        { Identifier: 3, Giblets: 'd5s86eE5', Name: 'Gabe', Cost: 477, Date: '1/23/4567' },
        { Identifier: 4, Giblets: 'a6sEF651dud5', Name: 'Bill', Cost: 2155, Date: '1/21/2016' },
        { Identifier: 5, Giblets: '5s6E', Name: 'Harold', Cost: 99999, Date: '99/99/9999' }
    ];

    var comparisonTable;

    beforeEach(function(){
        comparisonTable = new ComparisonTable(mockedSheet);
    });

    it("should get the total number of records", function(){
        expect(comparisonTable.records).toBe(mockedSheet.length);
    });

    it("should get the first record", function(){
        expect(comparisonTable.first).toBe(mockedSheet[0]);
        expect(comparisonTable.first.Name).toBe('Lance');
        expect(comparisonTable.first.Date).toBe('2/14/1994');
    });

    it("should get the middle record", function(){
        expect(comparisonTable.middle).toBe(mockedSheet[Math.floor(mockedSheet.length/2)]);
        expect(comparisonTable.middle.Name).toBe('Gabe');
        expect(comparisonTable.middle.Date).toBe('1/23/4567');
    });

    it("should get the last record", function(){
        expect(comparisonTable.last).toBe(mockedSheet[mockedSheet.length-1]);
        expect(comparisonTable.last.Name).toBe('Harold');
        expect(comparisonTable.last.Date).toBe('99/99/9999');
    });

    it("should get the minimum character count of the 'Identifier' column", function(){
        expect(comparisonTable.getMin('Identifier')).toBe(1);
    });

    it("should get the minimum character count of the 'Name' column", function(){
        expect(comparisonTable.getMin('Name')).toBe(3);
    });

    it("should get the minimum character count of the 'Giblets' column", function(){
        expect(comparisonTable.getMin('Giblets')).toBe('X');
    });

    it("should get the minimum character count of the 'Cost' column", function(){
        expect(comparisonTable.getMin('Cost')).toBe(3);
    });

    it("should get the minimum character count of the 'Date' column", function(){
        expect(comparisonTable.getMin('Date')).toBe(9);
    });

    it("should get the maximum character count of the 'Identifier' column", function(){
        expect(comparisonTable.getMax('Identifier')).toBe(1);
    });

    it("should get the maximum character count of the 'Name' column", function(){
        expect(comparisonTable.getMax('Name')).toBe(6);
    });

    it("should get the maximum character count of the 'Giblets' column", function(){
        expect(comparisonTable.getMax('Giblets')).toBe(12);
    });

    it("should get the maximum character count of the 'Cost' column", function(){
        expect(comparisonTable.getMax('Cost')).toBe(5);
    });

    it("should get the maximum character count of the 'Date' column", function(){
        expect(comparisonTable.getMax('Date')).toBe(10);
    });

});
