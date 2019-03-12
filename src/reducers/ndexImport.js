import { handleActions } from 'redux-actions'
import {
  saveToNDExFailed,
  saveToNDExStarted,
  saveToNDExSucceeded,
  saveToNDExCancelled
} from '../actions/ndexImport'

const defaultState = {
  isImportingNetwork: false,
  error: null
}

const source = handleActions(
  {
    [saveToNDExStarted]: (state, payload) => {
      return {
        ...state,
        isImportingNetwork: true,
        error: null
      }
    },
    [saveToNDExSucceeded]: (state, payload) => {
      return {
        ...state,
        isImportingNetwork: false,
        error: null
      }
    },
    [saveToNDExFailed]: (state, payload) => {
      console.warn('Error:', payload.error)
      return {
        ...state,
        isImportingNetwork: false,
        error: payload.error
      }
    },
    [saveToNDExCancelled]: (state, payload) => {
      return {
        ...state
      }
    }
  },
  defaultState
)

export default source
