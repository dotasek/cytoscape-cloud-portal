import { METHOD_GET, METHOD_POST } from './apiConstants'
const NDEX_BASE_URL = 'http://public.ndexbio.org/v2/'

const SEARCH_BASE_URL = 'http://secret.ndexbio.org:8090/'
const searchNetwork = (query, authHeaders) => {
  const baseHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
  const headers = Object.assign(baseHeaders, authHeaders)

  const body = JSON.stringify({
    searchString: query
  })
  const searchUrl = NDEX_BASE_URL + 'search/network'

  return fetch(searchUrl, {
    method: METHOD_POST,
    body,
    headers: new Headers(headers)
  })
}

const fetchNetwork = (id, sourceUUID, networkUUID, authHeaders) => {
  const baseHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
  const headers = Object.assign(baseHeaders, authHeaders)
  const fetchUrl =
    SEARCH_BASE_URL +
    '/overlaynetwork?sourceUUID=' +
    id +
    sourceUUID +
    '&networkUUID=' +
    networkUUID

  console.log('Calling CX API:', fetchUrl)

  return fetch(fetchUrl, {
    method: METHOD_GET,
    headers: new Headers(headers)
  })
}

const fetchUser = profile => {
  return fetch(profile.serverAddress + '/v2/user?valid=true', {
    headers: new Headers({
      Authorization: 'Basic ' + btoa(profile.userName + ':' + profile.password)
    })
  })
}

export { searchNetwork, fetchNetwork, fetchUser }
