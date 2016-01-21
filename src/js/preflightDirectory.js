var PreflightFile = require('./preflightFile');
var glob = require("multi-glob").glob;

var PreflightDirectory = function(path) {
    var model = this;

    model.path = path;

    model.files = [];

    model.getFiles = function(directory, callback){

        // Add trailing slash if doesn't exist
        if(directory.substr(-1,1) !== '/'){
            directory = directory + '/';
        }

        // Search for files to preflight
        glob([
            "**/!(*preflight).+(txt|csv|xlsx|xls|ods)",
        ], {cwd:directory}, function (er, files) {
            callback(files, directory);
        });
    };

    model.preflightFiles = function(path){
        var preflight;
        model.getFiles('/Users/dominickpeluso/Desktop/Shawmut/VDPBuddy/Samples', function(files, directory){ // change to path
            files.forEach(function(file){
                preflight = new PreflightFile( directory + file );
                preflight.init();
            });
        });
    };

    model.init = function(){
        model.preflightFiles(model.path);
    };
};

module.exports = PreflightDirectory;
