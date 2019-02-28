import { handleActions } from 'redux-actions'
import {
  setSettingsOpen,
  setNDExLoginOpen,
  setNDExImportOpen,
  setCytoscapeStatus
} from '../actions/uiState'

const DEF_STATE = {
  isCytoscapeRunning: false,
  isProfilesOpen: false,
  isNDExImportOpen: false,
  isNDExLoginOpen: false,
  urlParams: new URLSearchParams(window.location.search)
}

const uiState = handleActions(
  {
    [setSettingsOpen]: (state, payload) => {
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
    [setCytoscapeStatus]: (state, payload) => {
      console.log('Cytoscape is running = ', payload.payload)
      return { ...state, isCytoscapeRunning: payload.payload }
    }
  },
  DEF_STATE
)

export default uiState
