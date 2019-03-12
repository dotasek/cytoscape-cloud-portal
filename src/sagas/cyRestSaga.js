import { call, put, takeLatest, select } from 'redux-saga/effects'
import * as cyrest from '../api/cyrest'

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

const DEFAULT_PROFILE = {
  userName: undefined,
  password: undefined,
  serverAddress: 'http://dev.ndexbio.org'
}

/**
 * Calling CyREST network import
 *
 * @param action
 * @returns {IterableIterator<*>}
 */
function* watchImportNetwork(action) {
  const networkId = action.payload

  //Note: the accessKey value was formerly extracted from a share URL
  //the relevant code can be located at:
  //https://github.com/idekerlab/ndex-web/blob/e84b16d19175c439ed6f6b6ef483d55ec0a57fff/src/containers/Choose.js#L51
  const accessKey = undefined

  console.log('watchImportNetwork', action.payload)

  const profiles = yield select(getProfiles)
  const profile =
    profiles && profiles.selectedProfile
      ? profiles.selectedProfile
      : DEFAULT_PROFILE

  //const serverAddress =
  //  profile && profile.serverAddress
  //    ? profile.serverAddress
  //    : 'http://ndexbio.org'

  const { userName, password, serverAddress } = profile

  const payload = {
    username: userName,
    password: password,
    serverUrl: serverAddress + '/v2',
    uuid: networkId
  }
  //Note: this server value was formerly extracted from a share URL
  //the relevant code can be located at:
  //https://github.com/idekerlab/ndex-web/blob/e84b16d19175c439ed6f6b6ef483d55ec0a57fff/src/containers/Choose.js#L51
  const server = serverAddress
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
