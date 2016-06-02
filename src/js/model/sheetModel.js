var jdenticon = require("jdenticon");

var SheetModel = function(sheet_id) {

    var model = this;

    model.sheet_id = sheet_id;
    model.header = {};

    model.setHeaders = function(column_headers){
        model.header.headers = column_headers;
    };

    model.setHeadersHash = function(hash){
        model.header.hash = hash;
        model.header.hash_image = jdenticon.toSvg(hash, 34);
    };

};

module.exports = SheetModel;