var J = require('j');
var Table = require('cli-table2');
var ComparisonTable = require('./comparisonTable');
var fs = require('fs');
var async = require("async");

var PreflightFile = function(input, output, append){
    var model = this;

    model.debug = false;

    model.filename = input;

    model.preflightPath = output;

    model.appendFlag = append;

    model.header = "Gabe's Data Preflight - Version 0.0.1";

    model.purgeOldPreflight = function(append, callback){

        if(!model.preflightPath) return false;

        fs.stat(model.preflightPath, function(err, stats){
            if(stats && stats.isFile() && !append){
                fs.unlink(model.preflightPath, function(){
                   callback();
                });
            } else {
                callback();
            }
        });
    };

    model.write = function(path, data, append, callback){

        fs.appendFile(path, data+'\r\n\r\n', 'utf8', function(error) {
            callback(error, data);
        });

        // log
        //console.log(data);
    };

    model.appendSection = function(path, section, data, major, callback){
        var headerLine;
        if(major === true){
            headerLine = '\r\n=========================================================================================\r\n';
        } else {
            headerLine = '\r\n---------------------------------------------\r\n';
        }

        data = section + headerLine + data;
        //
        //if(typeof callback !== 'function'){
        //    console.log('CALLBACK NOT A FUNCTION');
        //    console.log(data);
        //    console.log('EEEENNNNNDDD');
        //}

        model.write(path, data, model.appendFlag, function(error, data){


            if(model.debug === true){
                console.log('action - ' + section)
            }

            callback(error, data);
        });
    };

    model.recordSection = function(sheet, callback){

        var number_of_records = sheet.length - 1;
        model.appendSection(model.preflightPath, 'Records', number_of_records, false, function() {
            callback();
        });
    };

    model.sheetNameSection = function(sheet, sheet_id, sheet_number, callback){
        model.appendSection(model.preflightPath, 'Sheet #'+sheet_number, sheet_id, true, function(){
            callback(sheet);
        });
    };

    model.timestampSection = function(callback){
        model.appendSection(model.preflightPath, 'Time', new Date().toISOString(), false, function(){
            callback();
        });
    };

    model.previewTableSection = function(sheet, callback){

        var comparison = new ComparisonTable(sheet);
        var columns = comparison.getTableRows();

        // Build table
        var table = new Table({
            head: ["HEADER", "FIRST", "MIDDLE", "LAST", "MN", "MX"],
            style: {
                head: [],    //disable colors in header cells
                border: []  //disable colors for the border
            },

            colWidths: [26, 16, 16, 16, 4, 4]
            //wordWrap:true
        });

        columns.forEach(function (column) {
            table.push(column);
        });

        model.appendSection(model.preflightPath, 'Preview', table.toString(), false, function() {
            callback(sheet);
        });
    };

    model.preflightSheet = function(sheet, sheet_id, callback){

        //Write sheet name
        model.appendSection(model.preflightPath, 'Sheet #', sheet_id, true, function(){
            model.previewTableSection(sheet, function(sheet){
                model.recordSection(sheet, function(){
                    model.timestampSection(function(){
                        console.log('done with this sheet' +sheet_id);
                        callback();
                    });
                });
            });
        });
    };

    model.preflightSheets = function(filename, callback){

        var readFileArray = J.readFile(filename);
        var workbookJson = J.utils.to_json(readFileArray);

        // Complete sheet preflight in a series
        async.forEachOfSeries(workbookJson, function (sheet, sheet_id, sheetCallback) {

            model.preflightSheet(sheet, sheet_id, function(){
                console.log('finished one sheet');

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

    model.init = function(){

        // Set default output if input left blank
        if(!model.preflightPath){
            model.preflightPath = model.filename+'_preflight.txt';
        }

        // Delete old preflight
        model.purgeOldPreflight(model.appendFlag, function(){
            console.log(1);

            // Write header
            model.write(model.preflightPath, model.header, model.appendFlag, function(){

                // Write filename
                model.appendSection(model.preflightPath, 'File', model.filename, true, function(){


                    model.preflightSheets(model.filename, function(){
                        // done
                    });

                });
            });
        });
    };
};

module.exports = PreflightFile;
