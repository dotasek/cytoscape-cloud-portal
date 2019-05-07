import { handleActions } from 'redux-actions'
import {
  getSaveToNDExParamsStarted,
  getSaveToNDExParamsSucceeded,
  saveToNDExFailed,
  saveToNDExStarted,
  saveToNDExSucceeded,
  saveToNDExCancelled,
  importFromNDExStarted,
  importFromNDExSucceeded,
  importFromNDExFailed
} from '../actions/ndexImport'

const defaultState = {
  importDialogParams: undefined,
  isImportingNetwork: false,
  error: null
}

const source = handleActions(
  {
    [getSaveToNDExParamsStarted]: (state, payload) => {
      return { ...state }
    },
    [getSaveToNDExParamsSucceeded]: (state, payload) => {
      return { ...state, importDialogParams: payload.payload }
    },
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
        importDialogParams: undefined,
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
        ...state,
        importDialogParams: undefined
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
