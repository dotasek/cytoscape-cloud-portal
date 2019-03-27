import { METHOD_GET, METHOD_POST } from './apiConstants'

const CYREST_BASE_URL = 'http://127.0.0.1'

const status = cyRESTPort => {
  const statusUrl = CYREST_BASE_URL + ':' + cyRESTPort + '/v1'

  //console.log('Calling CyREST API:', statusUrl)

  return fetch(statusUrl, {
    method: METHOD_GET
  })
}

const cyNDExStatus = cyRESTPort => {
  const cyNDExStatusUrl =
    CYREST_BASE_URL + ':' + cyRESTPort + '/cyndex2/v1/status'

  //console.log('Calling CyREST API:', cyNDExStatusUrl)

  return fetch(cyNDExStatusUrl, {
    method: METHOD_GET
  })
}

const importNetwork = (cyRESTPort, payload) => {
  const importNetworkUrl =
    CYREST_BASE_URL + ':' + cyRESTPort + '/cyndex2/v1/networks/cx'
  //console.log('Calling CyREST POST:', importNetworkUrl)

  return fetch(importNetworkUrl, {
    method: METHOD_POST,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
}

const ndexNetworkFetch = (profile, networkUUID, authHeaders) => {
  const baseHeaders = {
    'Content-Type': 'application/json'
  }
  const headers = Object.assign(baseHeaders, authHeaders)
  //console.log('ndexNetworkFetch headers', headers)
  return fetch(profile.serverAddress + '/v2/network/' + networkUUID, {
    method: METHOD_GET,
    headers: new Headers(headers)
  })
}

const cyndex2Networks = (cyRESTPort, method, suid, payload) => {
  const currentNetworkUrl =
    CYREST_BASE_URL + ':' + cyRESTPort + '/cyndex2/v1/networks/' + suid
  //console.log('Calling CyREST getNetwork:', currentNetworkUrl, method, payload)
  return fetch(currentNetworkUrl, {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: payload
  })
}

export {
  status,
  cyNDExStatus,
  importNetwork,
  cyndex2Networks,
  ndexNetworkFetch
}
