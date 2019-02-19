import { handleActions } from 'redux-actions'
import { setSettingsOpen } from '../actions/uiState'

const DEF_STATE = {
  isSettingsOpen: false,
  settingsAnchorEl: null
}

const uiState = handleActions(
  {
    [setSettingsOpen]: (state, payload) => {
      console.log('OPEN = ', payload.payload)
      return {
        ...state,
        isSettingsOpen: payload.payload.isSettingsOpen,
        settingsAnchorEl: payload.payload.isSettingsOpen
          ? payload.payload.anchorEl
          : null
      }
    }
  },
  DEF_STATE
)

export default uiState
