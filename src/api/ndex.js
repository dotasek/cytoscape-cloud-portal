import { METHOD_GET, BASE_URL } from './apiConstants'

const fetchNetwork = (id, sourceUUID, networkUUID, authHeaders) => {
  const baseHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
  const headers = baseHeaders //Object.assign(baseHeaders, authHeaders)
  const fetchUrl =
    BASE_URL +
    id +
    '/overlaynetwork?sourceUUID=' +
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

const fetchUserNetworks = profile => {
  return fetch(
    profile.serverAddress + '/v2/user/' + profile.userId + '/networksummary',
    {
      headers: new Headers({
        Authorization:
          'Basic ' + btoa(profile.userName + ':' + profile.password)
      })
    }
  )
}

export { fetchNetwork, fetchUser, fetchUserNetworks }
