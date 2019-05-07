import {
  METHOD_GET,
  METHOD_POST,
  BASE_URL,
  CYREST_BASE_URL
} from './apiConstants'

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

const checkPermissions = (profile, uuid) => {
  if (profile && profile.userId && uuid) {
    //console.log('profile for validation', profile)
    const userId = profile.userId
    const ndexUrl = profile.serverAddress
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(profile.userName + ':' + profile.password)
    }
    return fetch(
      ndexUrl + '/v2/user/' + userId + '/permission?networkid=' + uuid,
      {
        method: 'GET',
        headers: headers
      }
    )
  } else {
    return null
  }
}

const importNDExNetwork = (cyRESTPort, payload) => {
  const importNetworkUrl =
    CYREST_BASE_URL + ':' + cyRESTPort + '/cyndex2/v1/networks'
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

export {
  checkPermissions,
  fetchNetwork,
  fetchUser,
  fetchUserNetworks,
  importNDExNetwork
}
