import { call, put, takeLatest, select } from 'redux-saga/effects'
import * as cyrest from '../api/cyrest'
import * as ndex from '../api/ndex'

import {
  IMPORT_NETWORK_STARTED,
  IMPORT_NETWORK_FAILED,
  IMPORT_NETWORK_SUCCEEDED
} from '../actions/cyrest'

export default function* cyrestSaga() {
  console.log('cyrestSaga reporting for duty')
  yield takeLatest(IMPORT_NETWORK_STARTED, watchImportNetwork)
}

export const getUIState = state => state.uiState
export const getProfiles = state => state.profiles

/**
 * Calling CyREST network import
 *
 * @param action
 * @returns {IterableIterator<*>}
 */
function* watchImportNetwork(action) {
  const networkId = action.payload
  const accessKey = 0
  const server = ''

  console.log('watchImportNetwork', action.payload)

  const profiles = yield select(getProfiles)
  const profile = profiles.selectedProfile

  const serverAddress =
    profile && profile.serverAddress
      ? profile.serverAddress
      : 'http://ndexbio.org'

  let { userName, password } = profile

  const payload = {
    username: userName,
    password: password,
    serverUrl: serverAddress + '/v2',
    uuid: networkId
  }

  if (accessKey) {
    payload['accessKey'] = accessKey
    if (server !== serverAddress) {
      delete payload['username']
      delete payload['password']
    }
  }

  try {
    const uiState = yield select(getUIState)
    const cyrestport = uiState.urlParams.has('cyrestport')
      ? uiState.urlParams.get('cyrestport')
      : 1234

    const response = yield call(cyrest.importNetwork, cyrestport, payload)

    console.log('CyREST response:', response)

    yield put({
      type: IMPORT_NETWORK_SUCCEEDED,
      payload: {}
    })
  } catch (e) {
    console.warn('CyREST import network error:', e)
    yield put({
      type: IMPORT_NETWORK_FAILED,
      payload: {
        message: 'CyREST import network error',
        error: e.message
      }
    })
  }
}
