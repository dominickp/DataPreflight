var fs = require('fs');
var jade = require('jade');
var PreflightModel = require('./../model/preflightModel.js');


var PreflightFile = function(input, output, append, debug){
    var model = this;

    model.debug = false;

    model.filename = input;

    model.preflightPath = output;

    model.appendFlag = append;

    model.debugFlag = debug;

    model.header = "Gabe's Data Preflight - Version 0.0.1";

    model.purgeOldPreflight = function(append, callback){

        if(!model.preflightPath){
            return false;
        }

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

    model.writeFile = function(path, data, cb){

        fs.writeFileSync(path, data, 'utf8');

        cb();

        // log
        //console.log(data);
    };

    model.init = function(initCb){

        if(model.debugFlag){
            console.log("[Debugging on]");
        }


        var pm = new PreflightModel(model.filename, model.debugFlag, function(preflightModelReturn){

            pm = preflightModelReturn;

            if(preflightModelReturn !== false){

                if(model.debugFlag){
                    console.log("[Preflight done]", pm.basename);
                }

                // Jade testing
                var jadeOptions = {doctype: 'html', pretty:true};
                var fn = jade.compileFile(__dirname+'/../view/preflight.jade', jadeOptions);
                var html = fn({
                    workbook: pm
                });


                // Set default output if input left blank
                if(!model.preflightPath){
                    model.preflightPath = model.filename+'_preflight.html';
                }

                // Delete old preflight
                model.purgeOldPreflight(model.appendFlag, function(){

                    model.writeFile(model.preflightPath, html, function(){
                        // Allow for garbage cleanup
                        //preflightModelReturn = null;
                        initCb();
                    });

                });

            }

        });

    };
};

module.exports = PreflightFile;
