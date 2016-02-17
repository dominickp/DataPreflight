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

    model.preflightSheets = function(callback) {

        // Complete sheet preflight in a series
        async.forEachOfSeries(model.jWorkBook, function (sheet, sheet_id, sheetCallback) {

            var sheetModel = {
                sheet_id: sheet_id
            };

            model.preflightSheet(sheet, sheetModel, function (sheetModel) {
                console.log('finished one sheet', sheetModel);

                model.sheets.push(sheetModel);

                //console.log(sheetModel);


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

    model.preflightSheet = function(sheet, sheetModel, callback){



        // Number of records
        sheetModel.row_count = sheet.length;

        // Column preview
        var previewObject = model.getColumnPreview(sheet);
        sheetModel.column_preview = previewObject.columns;
        sheetModel.header_info = previewObject.header_info;

        console.log("One sheet", sheetModel);

        callback(sheetModel);
    };

    model.getColumnPreview = function(sheet){

        var comparison = new ComparisonTable(sheet);
        var previewObject = comparison.getTableRows();

        return previewObject;
    };


    model.init = function() {
        var readFileArray = J.readFile(model.filename);
        model.jWorkBook = J.utils.to_json(readFileArray);

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