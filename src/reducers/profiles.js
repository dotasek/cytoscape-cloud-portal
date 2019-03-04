import { handleActions } from 'redux-actions'
import {
  selectProfileStarted,
  selectProfileSucceeded,
  selectProfileFailed,
  addProfileStarted,
  addProfileFailed,
  addProfileSucceeded,
  deleteProfile
} from '../actions/profiles'

// Not happy about this, but JSON.parse does not create objects that are equal via ==
// so to make our post-init life easier, we do a compare via JSON.stringify here.
const initProfiles = (selectedProfileJSON, availableProfilesJSON) => {
  let selectedProfile = JSON.parse(selectedProfileJSON)
  const availableProfiles = JSON.parse(availableProfilesJSON) || []

  availableProfiles.forEach(element => {
    if (JSON.stringify(selectedProfile) == JSON.stringify(element)) {
      selectedProfile = element
    }
  })

  return {
    selectedProfile: selectedProfile,
    availableProfiles: availableProfiles
  }
}

const DEF_STATE = initProfiles(
  window.localStorage.getItem('selectedProfile'),
  window.localStorage.getItem('profiles')
)

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
        console.log("Deleting selectedProfile")
        selectedProfile =
          state.availableProfiles.length > 0 ? state.availableProfiles[0] : null
      }
      return {
        ...state,
        selectedProfile: selectedProfile,
        availableProfiles: profiles
      }
    }
  },
  DEF_STATE
)

export default profiles
