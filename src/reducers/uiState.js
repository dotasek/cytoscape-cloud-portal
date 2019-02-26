import { handleActions } from 'redux-actions'
import {
  setSettingsOpen,
  setNDExLoginOpen,
  setCytoscapeStatus
} from '../actions/uiState'

const DEF_STATE = {
  isCytoscapeRunning: false,
  isSettingsOpen: false,
  isNDExLoginOpen: false
}

const uiState = handleActions(
  {
    [setSettingsOpen]: (state, payload) => {
      console.log('Profiles OPEN payload.payload= ', payload.payload)
      return {
        ...state,
        isSettingsOpen: payload.payload.isSettingsOpen ? true : false,
        settingsAnchorEl: payload.payload.isSettingsOpen
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
    [setCytoscapeStatus]: (state, payload) => {
      console.log('Cytoscape is running = ', payload.payload)
      return { ...state, isCytoscapeRunning: payload.payload }
    }
  },
  DEF_STATE
)

export default uiState
