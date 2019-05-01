import { call, put, takeLatest, select } from 'redux-saga/effects'
import * as cyrest from '../api/cyrest'
import * as api from '../api/ndex'

import {
  ADD_PROFILE_STARTED,
  ADD_PROFILE_SUCCEEDED,
  ADD_PROFILE_FAILED,
  SELECT_PROFILE_STARTED,
  SELECT_PROFILE_SUCCEEDED,
  SELECT_PROFILE_FAILED,
  DELETE_PROFILE_STARTED,
  DELETE_PROFILE_SUCCEEDED,
  IMPORT_FROM_LOCAL_STORAGE
} from '../actions/profiles'

import { SET_AUTH_HEADERS } from '../actions/search'

import {
  NDEX_NETWORK_FETCH_STARTED,
  NETWORK_FETCH_SUCCEEDED,
  NETWORK_FETCH_FAILED,
  NETWORK_CLEAR
} from '../actions/network'

import {
  SET_NDEX_LOGIN_OPEN,
  SET_PROFILES_OPEN,
  SET_NDEX_IMPORT_OPEN,
  GET_CYNDEX_STATUS,
  SET_NDEX_ACTION_MESSAGE,
  SET_NDEX_SIGN_IN_HINT_OPEN,
  GET_MY_NETWORKS_STARTED,
  GET_MY_NETWORKS_SUCCEEDED,
  GET_MY_NETWORKS_FAILED,
  SET_CURRENT_NETWORK,
  CLEAR_MY_NETWORKS,
  setCurrentNetwork
} from '../actions/ndexUiState'

import {
  SAVE_TO_NDEX_STARTED,
  SAVE_TO_NDEX_SUCCEEDED,
  SAVE_TO_NDEX_FAILED,
  SAVE_TO_NDEX_CANCELLED,
  IMPORT_FROM_NDEX_STARTED,
  IMPORT_FROM_NDEX_SUCCEEDED,
  IMPORT_FROM_NDEX_FAILED
} from '../actions/ndexImport'

export default function* cyNDExSaga() {
  console.log('cyNDExSaga reporting for duty')
  yield takeLatest(ADD_PROFILE_STARTED, watchLogin)
  yield takeLatest(SELECT_PROFILE_STARTED, watchProfileSelect)
  yield takeLatest(SAVE_TO_NDEX_STARTED, watchSaveToNDEx)
  yield takeLatest(IMPORT_FROM_LOCAL_STORAGE, watchImportFromLocalStorage)
  yield takeLatest(GET_CYNDEX_STATUS, watchGetCyNDExStatus)
  yield takeLatest(DELETE_PROFILE_STARTED, watchProfileDelete)
  yield takeLatest(SAVE_TO_NDEX_CANCELLED, watchSaveToNDExCancelled)
  yield takeLatest(GET_MY_NETWORKS_STARTED, watchGetMyNetworks)
  yield takeLatest(NDEX_NETWORK_FETCH_STARTED, watchNDExNetworkFetch)
  yield takeLatest(IMPORT_FROM_NDEX_STARTED, watchImportNDExNetwork)
  yield takeLatest(SELECT_PROFILE_SUCCEEDED, watchProfileSelectSucceeded)
}

export const getUIState = state => state.uiState
export const getProfiles = state => state.profiles
export const getAuthHeaders = state => state.search.authHeaders

function* watchLogin(action) {
  const profile = action.payload
  //const profile = {
  //  userId: 'dotasek',
  //  userName: 'D Otasek',
  //  serverAddress: 'dev.ndexbio.org',
  //  image: defaultProfilePic
  //}
  //console.log('watch login')
  yield put({
    type: ADD_PROFILE_SUCCEEDED,
    payload: profile
  })
  let profiles = yield select(getProfiles)
  window.localStorage.setItem(
    'profiles',
    JSON.stringify(profiles.availableProfiles)
  )

  yield put({
    type: SET_NDEX_ACTION_MESSAGE,
    payload:
      'Added NDEx user: ' + profile.userName + '@' + profile.serverAddress
  })

  yield put({ type: SET_NDEX_LOGIN_OPEN, payload: false })
  yield put({ type: SET_PROFILES_OPEN, payload: { isProfilesOpen: false } })
  yield put({ type: SELECT_PROFILE_STARTED, payload: profile })
}

function* watchGetCyNDExStatus(action) {
  //console.log('Getting CyNDEx status')
  const uiState = yield select(getUIState)
  const cyrestport = uiState.urlParams.has('cyrestport')
    ? uiState.urlParams.get('cyrestport')
    : 1234
  try {
    const response = yield call(cyrest.cyNDExStatus, cyrestport)

    const responseJson = yield call([response, 'json'])
    //console.log(responseJson)
  } catch (error) {
    if (!window.sessionStorage.getItem('cyndexUnconnectedWarningDisplayed')) {
      window.sessionStorage.setItem('cyndexUnconnectedWarningDisplayed', true)
      yield put({
        type: SET_NDEX_ACTION_MESSAGE,
        payload: 'Unable to connect to CyNDEx App'
      })
    }
  }
}

function* watchProfileSelectSucceeded(action) {
  const { selectedProfile } = action.payload

  yield put({
    type: SET_AUTH_HEADERS,
    payload: generateAuth(selectedProfile)
  })
  window.localStorage.setItem(
    'selectedProfile',
    JSON.stringify(selectedProfile)
  )
  yield put({ type: CLEAR_MY_NETWORKS, payload: undefined })
  yield put({ type: NETWORK_CLEAR, payload: undefined })
  if (selectedProfile) {
    yield put({
      type: SET_NDEX_ACTION_MESSAGE,
      payload:
        'Using NDEx as ' +
        selectedProfile.userName +
        '@' +
        selectedProfile.serverAddress
    })
  }
}

function* watchProfileSelect(action) {
  window.localStorage.setItem('selectedProfile', JSON.stringify(action.payload))
  const profile = action.payload

  if (profile && !profile.hasOwnProperty('userId')) {
    if (
      profile.hasOwnProperty('serverAddress') &&
      profile.hasOwnProperty('userName') &&
      !profile.hasOwnProperty('userId')
    ) {
      if (profile.userName !== '') {
        try {
          const response = yield call(api.fetchUser, profile)
          if (!response.ok) {
            throw Error()
          }
          const blob = response.json()

          const newProfile = Object.assign(profile, {
            userId: blob.externalId,
            firstName: blob.firstName,
            image: blob.image
          })
          const availableProfiles = yield select(
            getProfiles
          ).availableProfiles.filter(p => p !== profile)
          availableProfiles.push(newProfile)

          yield put({
            type: SELECT_PROFILE_SUCCEEDED,
            payload: {
              selectedProfile: newProfile,
              availableProfiles: availableProfiles
            }
          })
        } catch (error) {
          yield put({ type: SELECT_PROFILE_FAILED, payload: error })
          //  alert(
          //    'Unable to update profile from NDEx. Try logging in again'
          //  )
          //TODO: REINTRODUCE THIS
          //main.handleProfileLogout(profile)
          //main.handleProfileDelete(profile)
          //})
        }
      } else {
        const availableProfiles = yield select(
          getProfiles
        ).availableProfiles.filter(p => p !== profile)
        availableProfiles.push(profile)
        yield put({
          type: SELECT_PROFILE_SUCCEEDED,
          payload: {
            selectedProfile: profile,
            availableProfiles: availableProfiles
          }
        })
      }
    }
  } else {
    const profiles = yield select(getProfiles)
    yield put({
      type: SELECT_PROFILE_SUCCEEDED,
      payload: {
        selectedProfile: profile,
        availableProfiles: profiles.availableProfiles
      }
    })
  }
}

function* watchSaveToNDEx(action) {
  const uiState = yield select(getUIState)
  const cyrestport = uiState.urlParams.has('cyrestport')
    ? uiState.urlParams.get('cyrestport')
    : 1234

  const profiles = yield select(getProfiles)
  const selectedProfile = profiles.selectedProfile

  const { serverAddress, userName, password } = selectedProfile

  const metadata = {
    name: action.payload.state.name,
    author: action.payload.state.author,
    organism: action.payload.state.organism,
    version: action.payload.state.version,
    disease: action.payload.state.disease,
    tissue: action.payload.state.tissue,
    rightsHolder: action.payload.state.rightsHolder,
    reference: action.payload.state.reference,
    description: action.payload.state.description
  }

  const payloadObj = {
    username: userName,
    password: password,
    serverUrl: serverAddress + '/v2',
    metadata: metadata
  }

  let method = 'POST'
  if (action.payload.state.overwrite) {
    method = 'PUT'
  } else {
    payloadObj.isPublic = action.payload.state.public
  }
  const payload = JSON.stringify(payloadObj)

  const suid = action.payload.networkData[action.payload.state.saveType]['suid']

  if (userName === undefined || userName === '') {
    alert('You must be logged with your NDEx username to save a network.')
    return
  }

  const response = yield call(
    cyrest.cyndex2Networks,
    cyrestport,
    method,
    suid,
    payload
  )

  if (response.errors && response.errors.length !== 0) {
    yield put({
      type: SET_NDEX_ACTION_MESSAGE,
      payload: 'Error saving network to NDEx.'
    })
    console.error(response.errors)
    yield put({ type: SAVE_TO_NDEX_FAILED, payload: response.errors[0] })
    yield put({ type: SET_NDEX_IMPORT_OPEN, payload: false })
  } else {
    //this.saveImage(resp.data.suid, resp.data.uuid)
    console.log('response data: ', response)
    const shareURL = action.payload.state.public
      ? selectedProfile.serverAddress + '/#/network/' + response.data.uuid
      : null
    yield put({ type: SAVE_TO_NDEX_SUCCEEDED, payload: {} })
    yield put({ type: SET_NDEX_IMPORT_OPEN, payload: false })
/*
    yield put({
      type: SET_CURRENT_NETWORK,
      payload: { currentNetworkUUID: response.data.uuid }
    })
    */
    yield put({
      type: SET_NDEX_ACTION_MESSAGE,
      payload: shareURL
        ? 'Network saved to NDEx:' + shareURL
        : 'Network saved to NDEx'
    })
  }
}

function* watchImportFromLocalStorage(action) {
  const { availableProfiles, selectedProfile } = yield select(getProfiles)

  yield put({
    type: SET_AUTH_HEADERS,
    payload: generateAuth(selectedProfile)
  })
}

function* watchProfileDelete(action) {
  let profiles = yield select(getProfiles)
  let selectedProfile = profiles.selectedProfile

  const availableProfiles = profiles.availableProfiles.filter(
    p => p !== action.payload
  )

  window.localStorage.setItem('profiles', JSON.stringify(availableProfiles))

  yield put({
    type: DELETE_PROFILE_SUCCEEDED,
    payload: {
      selectedProfile: selectedProfile,
      availableProfiles: availableProfiles
    }
  })

  yield put({
    type: SET_NDEX_ACTION_MESSAGE,
    payload:
      'Removed NDEx user: ' +
      action.payload.userName +
      '@' +
      action.payload.serverAddress
  })

  if (selectedProfile == action.payload) {
    //console.log('Deleting selectedProfile')
    selectedProfile = availableProfiles.length > 0 ? availableProfiles[0] : null
    yield put({
      type: SELECT_PROFILE_STARTED,
      payload: selectedProfile
    })
  }
}

function* watchSaveToNDExCancelled(action) {
  yield put({
    type: SET_NDEX_IMPORT_OPEN,
    payload: false
  })
  yield put({
    type: SET_NDEX_ACTION_MESSAGE,
    payload: 'Save to NDEx cancelled'
  })
}

function* watchGetMyNetworks(action) {
  let profiles = yield select(getProfiles)
  let selectedProfile = profiles.selectedProfile

  yield put({ type: NETWORK_CLEAR, payload: undefined })

  if (selectedProfile) {
    const response = yield call(api.fetchUserNetworks, selectedProfile)
    const responseJson = yield call([response, 'json'])
    //console.log('My networks', responseJson)

    yield put({
      type: GET_MY_NETWORKS_SUCCEEDED,
      payload: responseJson
    })
  } else {
    yield put({
      type: GET_MY_NETWORKS_FAILED,
      payload: 'No profile available'
    })
  }
}

function* watchNDExNetworkFetch(action) {
  try {
    const profiles = yield select(getProfiles)
    const selectedProfile = profiles.selectedProfile

    const authHeaders = yield select(getAuthHeaders)
    //console.log('watchNDExNetworkFetch authHeaders', authHeaders)

    const params = action.payload
    const networkUUID = params.networkUUID

    const cx = yield call(
      cyrest.ndexNetworkFetch,
      selectedProfile,
      networkUUID,
      authHeaders.payload
    )
    const json = yield call([cx, 'json'])

    const ndexData = {
      username: selectedProfile.userName,
      password: selectedProfile.password,
      serverUrl: selectedProfile.serverAddress + '/v2',
      uuid: networkUUID
    }

    if (authHeaders.payload) {
      //ndexData['accessKey'] = authHeaders.payload
      //delete ndexData['username']
      //delete ndexData['password']
    }

    yield put({
      type: NETWORK_FETCH_SUCCEEDED,
      cx: json,
      ndexData: ndexData
    })
  } catch (error) {
    console.log(error)
    yield put({ type: NETWORK_FETCH_FAILED, error })
  }
}

function* watchImportNDExNetwork(action) {
  const ndexData = action.payload
  yield put({
    type: SET_NDEX_ACTION_MESSAGE,
    payload: 'Opening Network in Cytoscape'
  })

  console.log('watchImportNDExNetwork', action.payload)

  try {
    const uiState = yield select(getUIState)
    const cyrestport = uiState.urlParams.has('cyrestport')
      ? uiState.urlParams.get('cyrestport')
      : 1234

    const response = yield call(api.importNDExNetwork, cyrestport, ndexData)

    console.log('CyREST response:', response)

    yield put({
      type: IMPORT_FROM_NDEX_SUCCEEDED,
      payload: {}
    })
    yield put({
      type: SET_NDEX_ACTION_MESSAGE,
      payload: 'Network Opened in Cytoscape'
    })
  } catch (e) {
    console.warn('CyREST import network error:', e)
    yield put({
      type: IMPORT_FROM_NDEX_FAILED,
      payload: {
        message: 'CyREST import network error',
        error: e.message
      }
    })
  }
}

const generateAuth = profile => {
  return {
    Authorization: profile
      ? 'Basic ' + btoa(profile.userName + ':' + profile.password)
      : null
  }
}
