import { handleActions } from 'redux-actions'
import {
  saveToNDExFailed,
  saveToNDExStarted,
  saveToNDExSucceeded,
  saveToNDExCancelled,
  importFromNDExStarted,
  importFromNDExSucceeded,
  importFromNDExFailed
} from '../actions/ndexImport'

const defaultState = {
  isImportDialogReady: false,
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
    },
    [importFromNDExStarted]: (state, payload) => {
      return {
        ...state
      }
    },
    [importFromNDExSucceeded]: (state, payload) => {
      return {
        ...state
      }
    },
    [importFromNDExFailed]: (state, payload) => {
      console.warn('Error:', payload.error)
      return {
        ...state
      }
    }
  },

  defaultState
)

export default source
