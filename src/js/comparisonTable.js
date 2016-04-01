var _ = require('underscore');
var ColumnModel = require('./../model/columnModel');
var object_hash = require('object-hash');

var ComparisonTable = function(sheet, column_headers, debug){

    var model = this;

    model.debugFlag = debug;
    model.column_headers = column_headers;
    model.sheet = sheet;
    model.records = sheet.length;
    model.first = model.sheet[0];
    model.middle = model.sheet[Math.floor(model.records/2)];
    model.last = model.sheet[model.records-1];

    model.getMax = function(header){

        if(model.debugFlag){
            var console_tag = "------------[Finding column max]";
            console.time(console_tag);
        }

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

        if(model.debugFlag){
            console.timeEnd(console_tag);
        }

        return max;
    };

    model.getMin = function(header){

        if(model.debugFlag){
            var console_tag = "------------[Finding column min]";
            console.time(console_tag);
        }

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

        if(model.debugFlag){
            console.timeEnd(console_tag);
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

        // Garbage collection
        uniqueCharacters = null;

        return types_found;
    };

    model.getColumnHash = function(header){

        if(model.debugFlag){
            var console_tag = "------------[Hashing column]";
            console.time(console_tag);
        }

        var columnContents = [];

        sheet.forEach(function(row, index){
            var value = row[header];
            if(typeof value !== 'undefined'){
                columnContents.push(value);
            }
        });

        var hash = object_hash(columnContents);

        if(model.debugFlag){
            console.timeEnd(console_tag);
        }

        return hash;
    };

    model.getUniqueCharacters = function(header){

        if(model.debugFlag){
            var console_tag = "------------[Finding unique characters]";
            console.time(console_tag);
        }

        var all_characters = [];

        sheet.forEach(function(row){
            var value = row[header];
            if(typeof value !== "undefined"){
                value = value.toString();
                var characters = value.split('');
                //console.log(characters);
                all_characters = _.union(all_characters, characters);

            }
        });

        var uniqueValues = all_characters;

        all_characters = null;

        uniqueValues = uniqueValues.sort();

        if(model.debugFlag){
            console.timeEnd(console_tag);
        }

        return uniqueValues;
    };

    model.getUniques = function(header){

        if(model.debugFlag){
            var console_tag = "------------[Finding unique values]";
            console.time(console_tag);
        }

        var values = [];

        sheet.forEach(function(row){

            var value = row[header];

            if(_.indexOf(values, value, false) === -1){
                values.push(value);
            }

        });

        if(model.debugFlag){
            console.timeEnd(console_tag);
        }

        return values;
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



        // For each column
        // was iterating over column_headers
        model.column_headers.forEach(function(header){

            if(model.debugFlag){
                console.log("---------[Preflighting column]", header);
            }

            var column = new ColumnModel(header.toString());

            // I'll use these twice
            var uniqueCharacters = model.getUniqueCharacters(column.name);

            column.setAttributes(
                model.getMin(column.name),
                model.getMax(column.name),
                model.getUniques(column.name),
                uniqueCharacters,
                model.getType(uniqueCharacters)
            );

            column.setPreview(
                getValue(first_pairs, column.name),
                getValue(middle_pairs, column.name),
                getValue(last_pairs, column.name)
            );

            // Generate hash
            column.setHash(model.getColumnHash(column.name));

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
