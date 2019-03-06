import { call, put, takeLatest, select } from 'redux-saga/effects'
import * as cyrest from '../api/cyrest'
import * as api from '../api/ndex'

import {
  ADD_PROFILE_STARTED,
  ADD_PROFILE_SUCCEEDED,
  ADD_PROFILE_FAILED,
  SELECT_PROFILE_STARTED,
  SELECT_PROFILE_SUCCEEDED,
  SELECT_PROFILE_FAILED
} from '../actions/profiles'

import {
  SET_NDEX_LOGIN_OPEN,
  SET_PROFILES_OPEN,
  SET_NDEX_IMPORT_OPEN
} from '../actions/uiState'

import {
  SAVE_TO_NDEX_STARTED,
  SAVE_TO_NDEX_SUCCEEDED,
  SAVE_TO_NDEX_FAILED
} from '../actions/ndexImport'

export default function* cyNDExSaga() {
  console.log('cyNDExSaga reporting for duty')
  yield takeLatest(ADD_PROFILE_STARTED, watchLogin)
  yield takeLatest(SELECT_PROFILE_STARTED, watchProfileSelect)
  yield takeLatest(SAVE_TO_NDEX_STARTED, watchSaveToNDEx)
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
  }
}

function* watchSaveToNDEx(action) {
  const uiState = yield select(getUIState)
  const cyrestport = uiState.urlParams.has('cyrestport')
    ? uiState.urlParams.get('cyrestport')
    : 1234

  const profiles = yield select(getProfiles)
  console.log('Profiles: ', profiles)
  const selectedProfile = profiles.selectedProfile
  console.log('Selected profile: ', selectedProfile)

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

  console.log('action.payload.networkData', action.payload.networkData)

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
    alert('Error saving: ' + response.errors[0].message || 'Unknown')
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
  }
}
