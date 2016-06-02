exports.command = 'preflight [path]';

exports.describe = 'Preflights a single spreadsheet.';

exports.builder = {
    path: {
        required: true
    },
    output: {

    }
};

exports.handler = function (argv) {
    console.log('preflight called for path', argv.dir)
};