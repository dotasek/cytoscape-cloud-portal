import { handleActions } from 'redux-actions'
import { setSettingsOpen, setNDExLoginOpen } from '../actions/uiState'

const DEF_STATE = {
  isSettingsOpen: false,
  isNDExLoginOpen: false,
  settingsAnchorEl: null
}

const uiState = handleActions(
  {
    [setSettingsOpen]: (state, payload) => {
      console.log('Profiles OPEN payload.payload= ', payload.payload)
      return {
        ...state,
        isSettingsOpen: payload.payload.isSettingsOpen,
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
    }
  },
  DEF_STATE
)

export default uiState
