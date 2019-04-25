import * as profiles from './profiles'

describe('actions', () => {
  it('IMPORT_FROM_LOCAL_STORAGE action', () => {
    const expectedAction = {
      type: 'IMPORT_FROM_LOCAL_STORAGE'
    }
    expect(profiles.importFromLocalStorage()).toEqual(expectedAction)
  })
})
