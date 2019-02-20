import { handleActions } from 'redux-actions'
import { selectProfile, addProfile, deleteProfile } from '../actions/profiles'

const DEF_STATE = {
  selectedProfile: null,
  availableProfiles: []
}

const profiles = handleActions(
  {
    [addProfile]: (state, payload) => {
      console.log('addProfile = ', payload.payload)
      //window.localStorage.setItem('profiles', JSON.stringify(this.state.profiles))
      //window.localStorage.setItem('selectedProfile', JSON.stringify(profile))
      return {
        ...state,
        selectedProfile: payload.payload,
        availableProfiles: state.availableProfiles.concat([payload.payload])
      }
    },
    [selectProfile]: (state, payload) => {
      //window.localStorage.setItem('selectedProfile', JSON.stringify(payload.payload))
      return {
        ...state,
        selectedProfile: payload.payload
      }
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
