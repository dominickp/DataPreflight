var fs = require('fs');
var J = require('j');
var async = require("async");
var SheetModel = require('./model/sheetModel');

var ExtractProof = function(input, output, format, debug, initCallback){
    var model = this;

    model.debug = false;

    model.filename = input;

    model.proofPath = output;

    model.format = format;

    model.debugFlag = debug;


};

module.exports = ExtractProof;
