import { handleActions } from 'redux-actions'
import {
  setProfilesOpen,
  setNDExLoginOpen,
  setNDExImportOpen
} from '../actions/ndexUiState'

const DEF_STATE = {
  isProfilesOpen: false,
  isNDExImportOpen: false,
  isNDExLoginOpen: false,
  urlParams: new URLSearchParams(window.location.search)
}

const uiState = handleActions(
  {
    [setProfilesOpen]: (state, payload) => {
      console.log('Profiles OPEN payload.payload= ', payload.payload)
      return {
        ...state,
        isProfilesOpen: payload.payload.isProfilesOpen ? true : false,
        settingsAnchorEl: payload.payload.isProfilesOpen
          ? payload.payload.anchorEl
          : null
      }
    },
    [setNDExLoginOpen]: (state, payload) => {
      console.log('NDExLogin OPEN payload.payload= ', payload.payload)
      return {
        ...state,
        isNDExLoginOpen: payload.payload
      }
    },
    [setNDExImportOpen]: (state, payload) => {
      console.log('NDExImport OPEN payload.payload= ', payload.payload)
      return {
        ...state,
        isNDExImportOpen: payload.payload
      }
    }
  },
  DEF_STATE
)

export default uiState
