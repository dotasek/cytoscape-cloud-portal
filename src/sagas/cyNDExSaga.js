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
  SET_NDEX_LOGIN_OPEN,
  SET_PROFILES_OPEN,
  SET_NDEX_IMPORT_OPEN,
  GET_CYNDEX_STATUS,
  SET_NDEX_ACTION_MESSAGE
} from '../actions/ndexUiState'

import {
  SAVE_TO_NDEX_STARTED,
  SAVE_TO_NDEX_SUCCEEDED,
  SAVE_TO_NDEX_FAILED,
  SAVE_TO_NDEX_CANCELLED
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
}

export const getUIState = state => state.uiState
export const getProfiles = state => state.profiles

function* watchLogin(action) {
  const profile = action.payload
  //const profile = {
  //  userId: 'dotasek',
  //  userName: 'D Otasek',
  //  serverAddress: 'dev.ndexbio.org',
  //  image: defaultProfilePic
  //}
  console.log('watch login')
  yield put({
    type: ADD_PROFILE_SUCCEEDED,
    payload: profile
  })
  let profiles = yield select(getProfiles)
  window.localStorage.setItem(
    'profiles',
    JSON.stringify(profiles.availableProfiles)
  )
  window.localStorage.setItem('selectedProfile', JSON.stringify(profile))
  yield put({ type: SET_NDEX_LOGIN_OPEN, payload: false })
  yield put({ type: SET_PROFILES_OPEN, payload: { isProfilesOpen: false } })
  yield put({
    type: SET_NDEX_ACTION_MESSAGE,
    payload:
      'Added NDEx user: ' + profile.userName + '@' + profile.serverAddress
  })
}

function* watchGetCyNDExStatus(action) {
  console.log('Getting CyNDEx status')
  const uiState = yield select(getUIState)
  const cyrestport = uiState.urlParams.has('cyrestport')
    ? uiState.urlParams.get('cyrestport')
    : 1234
  try {
    const response = yield call(cyrest.cyNDExStatus, cyrestport)

    const responseJson = yield call([response, 'json'])
    console.log(responseJson)
  } catch (error) {
    yield put({
      type: SET_NDEX_ACTION_MESSAGE,
      payload: 'Unable to connect to CyNDEx App'
    })
  }
}

function* watchProfileSelect(action) {
  window.localStorage.setItem('selectedProfile', JSON.stringify(action.payload))
  const profile = action.payload
  if (!profile.hasOwnProperty('userId')) {
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
              profile: newProfile,
              availableProfiles: availableProfiles
            }
          })
          yield put({
            type: SET_NDEX_ACTION_MESSAGE,
            payload:
              'Using NDEx as ' +
              newProfile.userName +
              '@' +
              newProfile.serverAddress
          })
          yield put({
            type: SET_AUTH_HEADERS,
            payload: generateAuth(newProfile)
          })
          window.localStorage.setItem(
            'profiles',
            JSON.stringify(availableProfiles)
          )
          window.localStorage.setItem(
            'selectedProfile',
            JSON.stringify(newProfile)
          )
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
        yield put({
          type: SET_NDEX_ACTION_MESSAGE,
          payload:
            'Using NDEx as ' + profile.userName + '@' + profile.serverAddress
        })
        yield put({
          type: SET_AUTH_HEADERS,
          payload: generateAuth(profile)
        })
        window.localStorage.setItem(
          'profiles',
          JSON.stringify(availableProfiles)
        )
        window.localStorage.setItem('selectedProfile', JSON.stringify(profile))
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
    yield put({
      type: SET_NDEX_ACTION_MESSAGE,
      payload: 'Using NDEx as ' + profile.userName + '@' + profile.serverAddress
    })

    yield put({
      type: SET_AUTH_HEADERS,
      payload: generateAuth(profile)
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
    var shareURL = null
    if (action.payload.state.public) {
      shareURL =
        selectedProfile.serverAddress + '/#/network/' + response.data.uuid
    }
    yield put({ type: SAVE_TO_NDEX_SUCCEEDED, payload: {} })
    yield put({ type: SET_NDEX_IMPORT_OPEN, payload: false })
    yield put({
      type: SET_NDEX_ACTION_MESSAGE,
      payload: 'Network saved to NDEx: '
    })
  }
}

function* watchImportFromLocalStorage(action) {
  // Not happy about this, but JSON.parse does not create objects that are equal via ==
  // so to make our post-init life easier, we do a compare via JSON.stringify here.
  let selectedProfile = JSON.parse(
    window.localStorage.getItem('selectedProfile')
  )
  const availableProfiles =
    JSON.parse(window.localStorage.getItem('profiles')) || []

  availableProfiles.forEach(element => {
    if (JSON.stringify(selectedProfile) == JSON.stringify(element)) {
      selectedProfile = element
    }
  })

  yield put({
    type: SELECT_PROFILE_SUCCEEDED,
    payload: {
      selectedProfile: selectedProfile,
      availableProfiles: availableProfiles
    }
  })
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
  if (selectedProfile == action.payload) {
    console.log('Deleting selectedProfile')
    selectedProfile = availableProfiles.length > 0 ? availableProfiles[0] : null
  }
  yield put({
    type: DELETE_PROFILE_SUCCEEDED,
    payload: {
      selectedProfile: selectedProfile,
      availableProfiles: availableProfiles
    }
  })
  window.localStorage.setItem('profiles', JSON.stringify(availableProfiles))
  window.localStorage.setItem(
    'selectedProfile',
    JSON.stringify(selectedProfile)
  )
  yield put({
    type: SET_NDEX_ACTION_MESSAGE,
    payload:
      'Removed NDEx user: ' +
      action.payload.userName +
      '@' +
      action.payload.serverAddress
  })
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

const generateAuth = profile => {
  return {
    Authorization: profile
      ? 'Basic ' + btoa(profile.userName + ':' + profile.password)
      : null
  }
}