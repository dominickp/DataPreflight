var J = require('j');
var Table = require('cli-table2');
var ComparisonTable = require('./comparisonTable');
var fs = require('fs');

var PreflightFile = function(input, output, append){
    var model = this;

    model.filename = input;

    model.preflightPath = output;

    model.appendFlag = append;

    model.header = "Gabe's Data Preflight - Version 0.0.1";

    model.write = function(path, data, append){
        if(append){
            fs.appendFile(path, data+'\r\n\r\n', function(error) {
                //if (error) {
                //    //console.error("write error:  " + error.message);
                //} else {
                //    //console.log("Successful Write to " + path);
                //}
            });
        } else {
            fs.writeFile(path, data+'\r\n\r\n', function(error) {});
        }

        // log
        console.log(data);
    };

    model.appendSection = function(path, section, data, major){
        var headerLine;
        if(major === true){
            headerLine = '\r\n=========================================================================================\r\n';
        } else {
            headerLine = '\r\n---------------------------------------------\r\n';
        }

        data = section + headerLine + data;
        return model.write(path, data, model.appendFlag);
    };

    model.init = function(){

        // Set default output if input left blank
        if(!model.preflightPath){
            model.preflightPath = model.filename+'_preflight.txt';
        }

        // Write header
        model.write(model.preflightPath, model.header, model.appendFlag);

        // Write filename
        model.appendSection(model.preflightPath, 'File', model.filename, true);

        var readFileArray = J.readFile(model.filename);
        //var parsedObject = readFileArray[1];

        var workbookJson = J.utils.to_json(readFileArray);

        // Helper function
        Object.values = function (obj) {
            var vals = [];
            for( var key in obj ) {
                if ( obj.hasOwnProperty(key) ) {
                    vals.push(obj[key]);
                }
            }
            return vals;
        };

        // Loop through sheets
        var sheet_number = 1;
        for (var sheet_id in workbookJson) {

            // Write sheet name
            model.appendSection(model.preflightPath, 'Sheet #'+sheet_number, sheet_id, true);
            sheet_number++;

            // skip loop if the property is from prototype
            if (!workbookJson.hasOwnProperty(sheet_id)){
                continue;
            }
            var sheet = workbookJson[sheet_id];


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

            // Write sample table
            model.appendSection(model.preflightPath, 'Preview', table.toString());

            // Records
            var number_of_records = sheet.length - 1;
            model.appendSection(model.preflightPath, 'Records', number_of_records);

            // Timestamp
            model.appendSection(model.preflightPath, 'Time', new Date().toISOString());
        }
    };

};

module.exports = PreflightFile;
