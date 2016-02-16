var J = require('j');
var Table = require('cli-table2');
var ComparisonTable = require('./comparisonTable');
var fs = require('fs');
var async = require("async");
var jade = require('jade');
var PreflightModel = require('./../model/preflightModel.js');


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

    model.writeFile = function(path, data){

        fs.writeFileSync(path, data, 'utf8');

        // log
        //console.log(data);
    };

    model.init = function(){


        var pm = new PreflightModel(model.filename, function(){
            // Jade testing
            var jadeOptions = {doctype: 'html'};
            var fn = jade.compileFile(__dirname+'/../view/preflight.jade', jadeOptions);
            var html = fn({
                workbook: pm
            });

            console.log(pm.sheets.length);

            //console.log(Object.keys(pm.sheets[0].column_preview[0]));


            // Set default output if input left blank
            if(!model.preflightPath){
                model.preflightPath = model.filename+'_preflight.html';
            }

            // Delete old preflight
            model.purgeOldPreflight(model.appendFlag, function(){

                model.writeFile(model.preflightPath, html);

            });

        });



    };
};

module.exports = PreflightFile;
