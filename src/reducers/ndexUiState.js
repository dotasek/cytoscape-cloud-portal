import { handleActions } from 'redux-actions'
import {
  setProfilesOpen,
  setNDExLoginOpen,
  setNDExImportOpen,
  getCyNDExStatus,
  setNDExActionMessage,
  setNDExSignInHintOpen,
  getMyNetworksStarted,
  getMyNetworksSucceeded,
  getMyNetworksFailed,
  setCurrentNetwork,
  clearMyNetworks
} from '../actions/ndexUiState'

const DEF_STATE = {
  isProfilesOpen: false,
  isNDExImportOpen: false,
  isNDExLoginOpen: false,
  NDExActionMessage: undefined,
  NDExSignInHintOpen: true,
  myNetworks: undefined,
  currentNetworkUUID: undefined,
  currentNetworkNodeSize: undefined,
  currentNetworkEdgeSize: undefined,
  currentNetworkModified: undefined
}

const ndexUiState = handleActions(
  {
    [setProfilesOpen]: (state, payload) => {
      //console.log('Profiles OPEN payload.payload= ', payload.payload)
      return {
        ...state,
        isProfilesOpen: payload.payload.isProfilesOpen ? true : false,
        settingsAnchorEl: payload.payload.isProfilesOpen
          ? payload.payload.anchorEl
          : null
      }
    },
    [setNDExLoginOpen]: (state, payload) => {
      //console.log('NDExLogin OPEN payload.payload= ', payload.payload)
      return {
        ...state,
        isNDExLoginOpen: payload.payload
      }
    },
    [setNDExImportOpen]: (state, payload) => {
      return {
        ...state,
        isNDExImportOpen: payload.payload
      }
    },
    [getCyNDExStatus]: (state, payload) => {
      //console.log('getCyNDExStatus = ', payload.payload)
      return {
        ...state
      }
    },
    [setNDExActionMessage]: (state, payload) => {
      //console.log('setNDExActionMessage = ', payload.payload)
      return {
        ...state,
        NDExActionMessage: payload.payload
      }
    },
    [setNDExSignInHintOpen]: (state, payload) => {
      return {
        ...state,
        NDExSignInHintOpen: payload.payload
      }
    },
    [getMyNetworksStarted]: (state, payload) => {
      //console.log('getMyNetworksStarted', payload.payload)
      return {
        ...state
      }
    },
    [getMyNetworksSucceeded]: (state, payload) => {
      //console.log('getMyNetworksSucceeded', payload.payload)
      return {
        ...state,
        myNetworks: payload.payload
      }
    },
    [getMyNetworksFailed]: (state, payload) => {
      //console.log('getMyNetworksFailed', payload.payload)
      return {
        ...state
      }
    },
    [clearMyNetworks]: (state, payload) => {
      return {
        ...state,
        myNetworks: null
      }
    },
    [setCurrentNetwork]: (state, payload) => {
      return {
        ...state,
        currentNetworkUUID: payload.payload.currentNetworkUUID,
        currentNetworkNodeSize: payload.payload.currentNetworkNodeSize,
        currentNetworkEdgeSize: payload.payload.currentNetworkEdgeSize,
        currentNetworkModified: payload.payload.currentNetworkModified
      }
    }
  },
  DEF_STATE
)

export default ndexUiState
