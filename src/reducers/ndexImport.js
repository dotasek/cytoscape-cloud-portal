import { handleActions } from 'redux-actions'
import {
  importNetworkFailed,
  importNetworkStarted,
  importNetworkSucceeded
} from '../actions/ndexImport'

const defaultState = {
  isImportingNetwork: false,
  error: null
}

const source = handleActions(
  {
    [importNetworkStarted]: (state, payload) => {
      return {
        ...state,
        isImportingNetwork: true,
        error: null
      }
    },
    [importNetworkSucceeded]: (state, payload) => {
      return {
        ...state,
        isImportingNetwork: false,
        error: null
      }
    },
    [importNetworkFailed]: (state, payload) => {
      console.warn('Error:', payload.error)
      return {
        ...state,
        isImportingNetwork: false,
        error: payload.error
      }
    }
  },
  defaultState
)

export default source
