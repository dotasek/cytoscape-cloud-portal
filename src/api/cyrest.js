import { METHOD_GET, METHOD_POST } from './apiConstants'
const CYREST_BASE_URL = 'http://127.0.0.1'

const status = cyRESTPort => {
  const statusUrl = CYREST_BASE_URL + ':' + cyRESTPort + '/v1'

  console.log('Calling CyREST API:', statusUrl)

  return fetch(statusUrl, {
    method: METHOD_GET
  })
}

export { status }
