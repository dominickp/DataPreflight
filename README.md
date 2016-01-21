# DataPreflight
A utility to preflight databases.

## Installation
```
npm install -g
```

## Usage
Use 'data-preflight' or 'node Path/to/repo/src/js/interface.js'

### Preflight file
The 'preflight' action produces a preflight report, showing the sheet name, headers, first/middle/last, and the max/mins for each column. If the '--output' parameter is left blank, it will create the preflight in the same directory as the input file with "_preflight.txt" appended. You may also use the optional flag '--append' to append the preflight reports, instead of overwriting them. If you are verison controlling your databases, you probably want to overwrite them.
```
$ data-preflight --action=preflight --input=/Users/dominickpeluso/Desktop/Sample_spreadsheet.csv
```

### Preflight directory
You may also recursively preflight an entire directory. Doing so will scan the directory and all sub-folders for spreadsheet files and preflight them all. You may also specify an '--append' flag here.

```
$ data-preflight --action=preflight-dir --input=/Users/dominickpeluso/Desktop/Samples
```

### Example preflight report
```
Sheet #1
=========================================================================================
Sheet1

Time
---------------------------------------------
2016-01-21T20:54:41.072Z

Preview
---------------------------------------------
┌──────────────────────────┬────────────────┬────────────────┬────────────────┬────┬────┐
│ HEADER                   │ FIRST          │ MIDDLE         │ LAST           │ MN │ MX │
├──────────────────────────┼────────────────┼────────────────┼────────────────┼────┼────┤
│ One                      │ Data           │ Data           │ Data           │ 4  │ 4  │
├──────────────────────────┼────────────────┼────────────────┼────────────────┼────┼────┤
│ Two                      │ Data           │ Data           │ Data           │ 4  │ 4  │
├──────────────────────────┼────────────────┼────────────────┼────────────────┼────┼────┤
│ Another column           │ Data           │ Data           │ Data           │ 4  │ 4  │
├──────────────────────────┼────────────────┼────────────────┼────────────────┼────┼────┤
│ Four                     │ Data           │ Data           │ Data           │ 4  │ 4  │
└──────────────────────────┴────────────────┴────────────────┴────────────────┴────┴────┘

Records
---------------------------------------------
1

Gabe's Data Preflight - Version 0.0.1

File
=========================================================================================
/Users/dominickpeluso/Desktop/Shawmut/VDPBuddy/Samples/Sample_4_col.csv


```