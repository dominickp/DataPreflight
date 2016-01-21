var ComparisonTable = require('../js/comparisonTable');

describe("preflight test", function(){
    var mockedSheet = [
        { Identifier: 1, Name: 'Lance', Cost: 711, Date: '2/14/1994' },
        { Identifier: 2, Name: 'Sam', Cost: 218, Date: '12/24/2036' },
        { Identifier: 3, Name: 'Gabe', Cost: 477, Date: '1/23/4567' },
        { Identifier: 4, Name: 'Bill', Cost: 2155, Date: '1/21/2016' },
        { Identifier: 5, Name: 'Harold', Cost: 99999, Date: '99/99/9999' }
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

    //it("should get the minimum character count of the 'Name' column", function(){
    //    expect(comparisonTable.getTableRows)
    //});



});


/*
    [
        { Identifier: 1, Name: 'Lance', Cost: 711, Date: '2/14/1994' },
        { Identifier: 2, Name: 'Sam', Cost: 218, Date: '12/24/2036' },
        { Identifier: 3, Name: 'Gabe', Cost: 477, Date: '1/23/4567' },
        { Identifier: 4, Name: 'Bill', Cost: 2155, Date: '1/21/2016' },
        { Identifier: 5, Name: 'Harold', Cost: 99999, Date: '99/99/9999' }
    ]
 */