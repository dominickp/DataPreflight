var J = require('j');
var async = require("async");
var ComparisonTable = require('./../js/comparisonTable');


var PreflightModel = function(filePath){
    var model = this;

    model.filename = filePath;

    model.jWorkBook = null;

    model.sheets = [];

    model.getBaseName = function(){
        var base = model.filename.substring(model.filename.lastIndexOf('/') + 1);
        if(base.lastIndexOf(".") != -1)
            base = base.substring(0, base.lastIndexOf("."));
        model.basename = base;
    }();

    model.preflightSheets = function(callback) {

        // Complete sheet preflight in a series
        async.forEachOfSeries(model.jWorkBook, function (sheet, sheet_id, sheetCallback) {

            var sheetModel = {
                sheet_id: sheet_id
            };

            model.preflightSheet(sheet, sheetModel, function (sheetModel) {
                console.log('finished one sheet');

                model.sheets.push(sheetModel);

                //console.log(sheetModel);

                sheetCallback();
            });

        }, function (err) {
            if (err) console.error(err.message);
            // configs is now a map of JSON data
            //console.log(workbookJson);
            console.log('done with all');
            callback();
        });
    };

    model.preflightSheet = function(sheet, sheetModel, callback){

        console.log(sheet);

        // Number of records
        sheetModel.row_count = sheet.length;

        // Column preview
        sheetModel.column_preview = model.getColumnPreview(sheet);


        console.log(sheetModel.column_preview[0].One)
        callback(sheetModel);
    };

    model.getColumnPreview = function(sheet){

        var comparison = new ComparisonTable(sheet);
        var columns = comparison.getTableRows();

        return columns;
    };


    model.init = function() {
        var readFileArray = J.readFile(model.filename);
        model.jWorkBook = J.utils.to_json(readFileArray);

        model.preflightSheets(function(){
            console.log("done");
        });
    }();

};

module.exports = PreflightModel;