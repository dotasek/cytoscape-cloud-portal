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
import defaultProfilePic from '../assets/images/default-profile.png'

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
      const profiles = state.availableProfiles.filter(
        p => p !== payload.payload
      )
      return {
        ...state,
        availableProfiles: profiles
      }
    }
  },
  DEF_STATE
)

export default profiles
