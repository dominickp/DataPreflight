var PreflightFile = require('./preflightFile');
var glob = require("multi-glob").glob;
var async = require("async");

var PreflightDirectory = function(path, format, debug) {
    var model = this;

    model.path = path;

    model.files = [];

    model.format = format;

    model.debugFlag = debug;

    model.getFiles = function(directory, callback){

        // Add trailing slash if doesn't exist
        if(directory.substr(-1,1) !== '/'){
            directory = directory + '/';
        }

        // Search for files to preflight
        glob([
            "**/!(*preflight).+(txt|csv|xlsx|xls|ods)"
        ], {cwd:directory}, function (er, files) {
            callback(files, directory);
        });
    };

    model.preflightFiles = function(path){
        model.getFiles(path, function(files, directory){
            var preflight;
            async.forEachOfSeries(files, function (file, key, callback) {
                preflight = new PreflightFile( directory + file, null, model.format, model.debugFlag );
                preflight.init(function(){
                    // Preflight written
                    console.log("Preflight complete.");
                    preflight = null;
                    callback();
                });
            }, function (err) {
                if (err){
                    console.error(err.message);
                }
            });
        });
    };

    model.init = function(){
        model.preflightFiles(model.path);
    };
};

module.exports = PreflightDirectory;
