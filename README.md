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
$ data-preflight --action=preflight-dir --path=/Users/dominickpeluso/Desktop/MySpreadsheets

$ data-preflight --action=preflight-dir --path=/Users/dominickpeluso/Desktop/MySpreadsheets --debug
```

## Preflights
Preflights are standalone HTML report documents. They show details about the structure and data within a spreadsheet. The goal of the preflight is to be used by an operator who can easily check assumptions and catch data errors within the spreadsheet.

### Overview
The spreadsheet overview shows the name of the spreadsheet and some basic statistics. It also has a collapsable panel for each sheet within the workbook. 

<img src="https://i.imgur.com/NyolRYA.png" width="400">

### Data Integrity Check
This section shows the column headers as well as actual data from the first, middle, and last rows of the database. Additionally, it shows the row positions for the first/middle/last, to make data checks easier to reference. 

#### Column data hash
On the right side of this table is a hash image for each column. The hash image is computed from the data within the column (except the header row). In the example below, each column has an identical hash image because the data within this example spreadsheet is identical for each column.

<img src="https://i.imgur.com/m4hhW5Q.png" width="600">

### Column Details
This section shows additional details for each column. It shows the minimum value length, maximum value length, number of unique values, and number of unique characters found. Clicking on the unique values or unique characters will show panels which display the values and characters found. 

#### Column Warnings
Column warnings show potential problems in the column. As of now, it checks for completely static column values, blank values, and non-ascii characters.

#### Column Types
The preflight will also guess at the types of characters which appeared in each column. Currently, it checks for alphabetic (lowercase), alphabetic (uppercaser), punctuation, non-ascii, and numeric.

<img src="https://i.imgur.com/Iv6StLc.png" width="600">

### Example
See the [Examples directory](../master/Examples) to see an example spreadsheet with a rendered preflight.
