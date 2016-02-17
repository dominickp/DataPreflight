var J = require('j');
var async = require("async");
var ComparisonTable = require('./../js/comparisonTable');


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
            if(cell && cell.t) hdr = J.XLSX.utils.format_cell(cell);

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

            //console.log("column_headers", column_headers);

            model.preflightSheet(sheet, sheetModel, column_headers, function (sheetModel) {

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

    model.preflightSheet = function(sheet, sheetModel, column_headers, callback){



        // Number of records
        sheetModel.row_count = sheet.length;

        // Column preview
        var previewObject = model.getColumnPreview(sheet, column_headers);
        sheetModel.column_preview = previewObject.columns;
        sheetModel.header_info = previewObject.header_info;

        //console.log("One sheet", sheetModel);

        // Verify header row
        //model.checkHeaderRow(model.sheets, model.readFileArray);

        callback(sheetModel);
    };

    model.getColumnPreview = function(sheet, column_headers){

        var comparison = new ComparisonTable(sheet, column_headers);
        var previewObject = comparison.getTableRows();

        return previewObject;
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
        //console.log("readFileArray",readFileArray[0].utils.decode_col);

        model.preflightSheets(function(){
            //console.log("done");

            console.log("model.sheets.length", model.sheets.length);


            initCallback(model);
        });
    }();

};

module.exports = PreflightModel;