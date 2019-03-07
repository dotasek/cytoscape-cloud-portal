import * as profiles from './profiles'
import * as actions from '../actions/profiles'

describe('reducers', () => {
  it('default reducer', () => {
    const expectedState = {
      availableProfiles: [],
      selectedProfile: null
    }
    expect(profiles.default(undefined, {})).toEqual(expectedState)
  })

  it('should handle GET_POST_SUCCESS', () => {})
})
