import { handleActions } from 'redux-actions'
import {
  selectProfileStarted,
  selectProfileSucceeded,
  selectProfileFailed,
  addProfileStarted,
  addProfileFailed,
  addProfileSucceeded,
  deleteProfile,
  importFromLocalStorage
} from '../actions/profiles'

const DEF_STATE = {
  selectedProfile: null,
  availableProfiles: []
}

const profiles = handleActions(
  {
    [addProfileStarted]: (state, payload) => {
      console.log('addProfileStarted = ', payload.payload)
      return {
        ...state
      }
    },
    [addProfileFailed]: (state, payload) => {
      console.log('addProfileFailed = ', payload.payload)
      return {
        ...state
      }
    },
    [addProfileSucceeded]: (state, payload) => {
      console.log('addProfileSucceeded = ', payload.payload)
      return {
        ...state,
        selectedProfile: payload.payload,
        availableProfiles: state.availableProfiles
          ? state.availableProfiles.concat([payload.payload])
          : [payload.payload]
      }
    },
    [selectProfileStarted]: (state, payload) => {
      console.log('selectProfileStarted = ', payload.payload)
      return { ...state }
    },
    [selectProfileSucceeded]: (state, payload) => {
      console.log('selectProfileSucceeded = ', payload.payload)
      return {
        ...state,
        selectedProfile: payload.payload.selectedProfile,
        availableProfiles: payload.payload.availableProfiles
      }
    },
    [selectProfileFailed]: (state, payload) => {
      console.log('selectProfileFailed = ', payload.payload)
      return { ...state }
    },
    [deleteProfile]: (state, payload) => {
      let selectedProfile = state.selectedProfile
      const profiles = state.availableProfiles.filter(
        p => p !== payload.payload
      )
      if (selectedProfile == payload.payload) {
        console.log('Deleting selectedProfile')
        selectedProfile = profiles.length > 0 ? profiles[0] : null
      }
      return {
        ...state,
        selectedProfile: selectedProfile,
        availableProfiles: profiles
      }
    },
    [importFromLocalStorage]: (state, payload) => {
      console.log('importFromLocalStorage = ', payload.payload)
      return {
        ...state
      }
    }
  },
  DEF_STATE
)

export default profiles
