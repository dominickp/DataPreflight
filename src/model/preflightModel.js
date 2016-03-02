var J = require('j');
var async = require("async");
var ComparisonTable = require('./../js/comparisonTable');
var _ = require('underscore');


var PreflightModel = function(filePath, initCallback){
    var model = this;

    model.filename = filePath;

    model.jWorkBook = null;

    model.sheets = [];

    model.getBaseName = function(){
        var base = model.filename.substring(model.filename.lastIndexOf('/') + 1);
        if(base.lastIndexOf(".") !== -1){
            base = base.substring(0, base.lastIndexOf("."));
        }
        model.basename = base;
    }();

    model.get_header_row = function(readFileArray, sheet_id) {
        var sheet = readFileArray[1].Sheets[sheet_id];
        var headers = [];
        var range = J.XLSX.utils.decode_range(sheet['!ref']);
        var C, R = range.s.r; /* start in the first row */
        /* walk every column in the range */
        for(C = range.s.c; C <= range.e.c; ++C) {
            var cell = sheet[J.XLSX.utils.encode_cell({c:C, r:R})]; /* find the cell in the first row */

            var hdr = "UNKNOWN " + C; // <-- replace with your desired default
            if(cell && cell.t){
                hdr = J.XLSX.utils.format_cell(cell);
            }

            headers.push(hdr);
        }
        return headers;
    };

    model.preflightSheets = function(callback) {

        // Complete sheet preflight in a series
        async.forEachOfSeries(model.jWorkBook, function (sheet, sheet_id, sheetCallback) {

            var sheetModel = {
                sheet_id: sheet_id
            };

            // Determine header row
            var column_headers = model.get_header_row(model.readFileArray, sheet_id);
            //sheetModel.columns.headers = column_headers;

            //console.log("column_headers", column_headers);

            model.preflightSheet(sheet, sheetModel, column_headers, sheet_id, function (sheetModel) {

                model.sheets.push(sheetModel);

                sheetCallback();
            });

        }, function (err) {
            if (err){
                console.error(err.message);
            }
            // configs is now a map of JSON data
            //console.log(workbookJson);
            //console.log('done with all');
            callback();
        });
    };

    model.preflightSheet = function(sheet, sheetModel, column_headers, sheet_id, callback){

        // Number of records
        sheetModel.row_count = sheet.length;

        // Column preview
        var columnComparison = model.getColumns(sheet, column_headers);
        sheetModel.columns = columnComparison.columns;
        sheetModel.header_info = columnComparison.header_info;

        // Check warnings
        sheetModel.warnings = model.getSheetWarnings(sheet);

        callback(sheetModel);
    };

    model.getSheetWarnings = function(sheet){

        var warnings = {
            "non_ascii_characters": []
        };

        var row_num = 0;

        sheet.forEach(function(row){
            _.each(row, function(value, column){
                // Check for non-ascii characters
                if(/^[ -~]+$/.test(value) === false) {
                    console.log("Strange character found: ", value, column);
                    warnings.non_ascii_characters.push({
                        value: value,
                        column: column,
                        row: row_num
                    });
                }
                row_num++;
            });
        });
        return warnings;
    };

    model.appendColumnWarnings = function(columns){
        columns.forEach(function(column){
            // Check for blank values
            if(column.attributes.min === "X"){
                column.addWarning("Blank values");
            }
            // Check for static values
            if(column.attributes.uniques.length === 1){
                column.addWarning("Static value");
            }
            // Check for non-ascii characters
            if(column.attributes.types.non_ascii === true){
                column.addWarning("Non-ASCII characters");
            }
        });

        return columns;
    };

    model.getColumns = function(sheet, column_headers){

        var comparison = new ComparisonTable(sheet, column_headers);
        var comparisonColumns = comparison.getTableRows();

        comparisonColumns.columns = model.appendColumnWarnings(comparisonColumns.columns);

        return comparisonColumns;
    };

    //model.checkHeaderRow = function(sheet, readFileArray){
    //    var csv = J.utils.to_json(model.readFileArray);
    //
    //    console.log("csv",csv);
    //
    //
    //    var header_row = csv.split('\n')[0];
    //
    //    console.log(header_row);
    //};

    model.init = function() {
        model.readFileArray = J.readFile(model.filename);
        model.jWorkBook = J.utils.to_json(model.readFileArray);

        //console.log("to_csv", J.utils.to_csv(model.readFileArray));

        //console.log("jworkbook",model.jWorkBook);
        //console.log("readFileArray",model.readFileArray[1].Sheets.Sheet1.B2);

        model.preflightSheets(function(){
            //console.log("done");

            //console.log("model.sheets.length", model.sheets.length);


            initCallback(model);
        });
    }();

};

module.exports = PreflightModel;