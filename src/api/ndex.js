import { METHOD_GET, METHOD_POST } from './apiConstants'
const NDEX_BASE_URL = 'http://public.ndexbio.org/v2/'

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

  console.log('*******Calling NDEx API:', query, body, searchUrl)

  return fetch(searchUrl, {
    method: METHOD_POST,
    body,
    headers: new Headers(headers)
  })
}

const fetchNetwork = (uuid, authHeaders) => {
  const baseHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
  const headers = Object.assign(baseHeaders, authHeaders)

  const fetchUrl = NDEX_BASE_URL + 'network/' + uuid

  console.log('Calling CX API:', uuid, fetchUrl)

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
