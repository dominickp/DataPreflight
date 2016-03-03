# DataPreflight
A utility to preflight spreadsheets. Handles most types of spreadsheet formats (txt, csv, xls, xslx, ods, etc...) and will preflight multiple sheets if the input is a workbook.

*This readme needs to be updated.*

## Installation
```
npm install -g
data-preflight --version
```

## Usage
Use 'data-preflight' if you installed globally or 'node path/to/repo/src/js/interface.js' if you didn't.

### Preflight file
The 'preflight' action produces a preflight report. If the '--output' parameter is left blank, it will create the preflight in the same directory as the input file with "_preflight.html" appended. You may also add the optional flag '--debug' to see debug messags while the preflight runs.

```
$ data-preflight --action=preflight --input=/Users/dominickpeluso/Desktop/Sample_spreadsheet.csv --output=/Users/dominickpeluso/Desktop/my_preflight.txt

$ data-preflight --action=preflight --input=/Users/dominickpeluso/Desktop/AnotherSheet.csv --debug
```

### Preflight directory
You may also recursively preflight an entire directory. Doing so will scan the directory and all sub-folders for spreadsheet files and preflight them all. You may also specify a '--debug' flag here.

```
$ data-preflight --action=preflight-dir --input=/Users/dominickpeluso/Desktop/MySpreadsheets

$ data-preflight --action=preflight-dir --input=/Users/dominickpeluso/Desktop/MySpreadsheets --debug
```

### Examples