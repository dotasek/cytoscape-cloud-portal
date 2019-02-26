import { METHOD_GET, METHOD_POST } from './apiConstants'
const NDEX_BASE_URL = 'http://public.ndexbio.org/v2/'

const searchNetwork = (query, profile) => {
  let baseHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }

  const body = JSON.stringify({
    searchString: query
  })
  const searchUrl = NDEX_BASE_URL + 'search/network'

  console.log('*******Calling NDEx API:', query, body, searchUrl)

  if (profile) {
    baseHeaders['Authorization'] =
      'Basic ' + btoa(profile.userName + ':' + profile.password)
  }

  return fetch(searchUrl, {
    method: METHOD_POST,
    body,
    headers: new Headers(baseHeaders)
  })
}

const fetchNetwork = (uuid, profile) => {
  let baseHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }

  const fetchUrl = NDEX_BASE_URL + 'network/' + uuid

  if (profile) {
    baseHeaders['Authorization'] =
      'Basic ' + btoa(profile.userName + ':' + profile.password)
  }

  console.log('Calling CX API:', uuid, fetchUrl)

  return fetch(fetchUrl, {
    method: METHOD_GET,
    headers: new Headers(baseHeaders)
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
