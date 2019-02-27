import { METHOD_GET, METHOD_POST } from './apiConstants'
const CYREST_BASE_URL = 'http://127.0.0.1'

const status = cyRESTPort => {
  const statusUrl = CYREST_BASE_URL + ':' + cyRESTPort + '/v1'

  console.log('Calling CyREST API:', statusUrl)

  return fetch(statusUrl, {
    method: METHOD_GET
  })
}

const importNetwork = (cyRESTPort, payload) => {
  const importNetworkUrl =
    CYREST_BASE_URL + ':' + cyRESTPort + '/cyndex2/v1/networks'
  console.log('Calling CyREST API:', importNetworkUrl, payload)

  return fetch(importNetworkUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
}

export { status, importNetwork }
