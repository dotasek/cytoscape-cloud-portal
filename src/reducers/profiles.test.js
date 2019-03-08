import profiles from './profiles'
import * as actions from '../actions/profiles'

describe('reducers', () => {
  it('default reducer', () => {
    const expectedState = {
      availableProfiles: [],
      selectedProfile: null
    }
    expect(profiles(undefined, {})).toEqual(expectedState)
  })

  it('should handle GET_POST_SUCCESS', () => {
    const expectedState = {
      availableProfiles: [ "New profile" ],
      selectedProfile: "New profile"
    }

    expect(
      profiles(
        {},
        {
          type: actions.ADD_PROFILE_SUCCEEDED,
          payload: "New profile"
        }
      )
    ).toEqual(expectedState)
  })
})
