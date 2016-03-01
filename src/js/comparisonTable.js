var _ = require('underscore');
var ColumnModel = require('./../model/columnModel');

var ComparisonTable = function(sheet, column_headers){

    var model = this;

    model.column_headers = column_headers;
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

        if(max === 0){
            max = 'X';
        }
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

    model.getType = function(uniqueCharacters){
        var types_found = {
            numeric: false,
            alpha_lower: false,
            alpha_upper: false,
            non_ascii: false,
            punctuation: false
        };

        uniqueCharacters.forEach(function(char){
            // Test numeric
            if(!isNaN(char)){
                types_found.numeric = true;
            } else {
                // Test case letters
                if(char === char.toUpperCase()){
                    types_found.alpha_upper = true;
                }
                if(char === char.toLowerCase()){
                    types_found.alpha_lower = true;
                }
            }

            // Test non-ascii
            if(char.charCodeAt(0) > 127){
                types_found.non_ascii = true;
            }

            // Test punctuation
            if( ( char.charCodeAt(0) > 31 ) && (char.charCodeAt(0) < 48) ){
                types_found.punctuation = true;
            }
        });


        return types_found;
    };

    model.getTableRows = function(){

        var first_pairs = _.pairs(model.first);
        var middle_pairs = _.pairs(model.middle);
        var last_pairs = _.pairs(model.last);
        var columns = [];

        var header_info = {
            first_position: 2,
            middle_position: (Math.floor(model.records/2)+2),
            last_position: (model.records+1)
        };

        var getValue = function(pairs, header){
            var value = '';
            pairs.forEach(function(pair, lastIndex){
                if(pair.indexOf(header) === 0){
                    value = pairs[lastIndex][1];
                }
            });

            return value;
        };

        var getUniques = function(header){


            var values = [];

            sheet.forEach(function(row){
                values.push(row[header]);
            });

            var uniqueValues = _.uniq(values);

            return uniqueValues;
        };

        var getUniqueCharacters = function(header){

            var all_characters = [];

            sheet.forEach(function(row){
                var value = row[header];
                if(typeof value !== "undefined"){
                    value = value.toString();
                    var characters = value.split('');
                    //console.log(characters);
                    all_characters = all_characters.concat(characters);

                }
            });

            var uniqueValues = _.uniq(all_characters);

            uniqueValues = uniqueValues.sort();

            return uniqueValues;
        };

        // For each column
        // was iterating over column_headers
        column_headers.forEach(function(header){

            var column = new ColumnModel(header.toString());

            // I'll use these twice
            var uniqueCharacters = getUniqueCharacters(column.name);

            column.setAttributes(
                model.getMin(column.name),
                model.getMax(column.name),
                getUniques(column.name),
                uniqueCharacters,
                model.getType(uniqueCharacters)
            );

            column.setPreview(
                getValue(first_pairs, column.name),
                getValue(middle_pairs, column.name),
                getValue(last_pairs, column.name)
            );

            columns.push(column);

        });

        //console.log("columns", columns);

        return {
            columns: columns,
            header_info: header_info
        };
    };

};

module.exports = ComparisonTable;
