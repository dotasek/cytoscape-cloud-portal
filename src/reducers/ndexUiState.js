import { handleActions } from 'redux-actions'
import {
  setProfilesOpen,
  setNDExLoginOpen,
  setNDExImportOpen,
  getCyNDExStatus,
  setNDExActionMessage
} from '../actions/ndexUiState'

const DEF_STATE = {
  isProfilesOpen: false,
  isNDExImportOpen: false,
  isNDExLoginOpen: false,
  NDExActionMessage: 'It rainin sideways!',
  urlParams: new URLSearchParams(window.location.search)
}

const ndexUiState = handleActions(
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
    },
    [getCyNDExStatus]: (state, payload) => {
      console.log('getCyNDExStatus = ', payload.payload)
      return {
        ...state
      }
    },
    [setNDExActionMessage]: (state, payload) => {
      console.log('setNDExActionMessage = ', payload.payload)
      return {
        ...state,
        NDExActionMessage: payload.payload
      }
    }
  },
  DEF_STATE
)

export default ndexUiState
