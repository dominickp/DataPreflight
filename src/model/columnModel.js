
var ColumnModel = function(name) {

    var column = this;

    column.name = name;
    column.preview = {};
    column.attributes = {};
    column.warnings = [];

    column.setAttributes = function(min, max, uniques){
        column.attributes.min = min;
        column.attributes.max = max;
        column.attributes.uniques = uniques;
    };

    column.setPreview = function(first, middle, last){
        column.preview.first = first;
        column.preview.middle = middle;
        column.preview.last = last;
    };

    column.addWarning = function(warning){
        column.warnings.push(warning);
    };

};

module.exports = ColumnModel;