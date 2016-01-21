var _ = require('underscore');

var ComparisonTable = function(sheet){

    var model = this;

    model.sheet = sheet;
    model.records = sheet.length;
    model.first = model.sheet[0];
    model.middle = model.sheet[Math.floor(model.records/2)];
    model.last = model.sheet[model.records-1];

    model.getMax = function(header){
        var max = 0;
        sheet.forEach(function(row){

            if(typeof row[header] !== 'undefined'){

                var valueLength = row[header].toString().trim().length;

                //
                if(valueLength > max){
                    max = valueLength;
                }
            }
        });
        return max;
    };

    model.getMin = function(header){
        var min;
        sheet.forEach(function(row, index){
            if(typeof row[header] !== 'undefined'){

                var valueLength = row[header].toString().trim().length;

                // Set initial value
                if(index === 0){
                    min = valueLength;
                }
                // Set to new value if lower found
                if(valueLength < min){
                    min = valueLength;
                }
            } else {
                min = 0;
            }
        });

        if(min === 0){
            min = 'X';
        }

        return min;
    };

    model.getTableRows = function(){

        var first_pairs = _.pairs(model.first);
        var middle_pairs = _.pairs(model.middle);
        var last_pairs = _.pairs(model.last);
        var columns = [];

        var getValue = function(pairs, header){
            var value = '';
            pairs.forEach(function(pair, lastIndex){
                if(pair.indexOf(header) === 0){
                    value = pairs[lastIndex][1];
                }
            });

            return value;
        };



        // For each column
        first_pairs.forEach(function(pair){

            var column = {};
            var header = pair[0];


            column[header] = [
                getValue(first_pairs, header),
                getValue(middle_pairs, header),
                getValue(last_pairs, header),
                model.getMin(header),
                model.getMax(header)
            ];

            columns.push(column);

        });

        return columns;
    };

};

module.exports = ComparisonTable;
