import { createAction } from 'redux-actions'

export const SELECT_PROFILE = 'SELECT_PROFILE'
export const selectProfile = createAction(SELECT_PROFILE)

export const ADD_PROFILE_STARTED = 'ADD_PROFILE_STARTED'
export const addProfileStarted = createAction(ADD_PROFILE_STARTED)

export const ADD_PROFILE_FAILED = 'ADD_PROFILE_FAILED'
export const addProfileFailed = createAction(ADD_PROFILE_FAILED)

export const ADD_PROFILE_SUCCEEDED = 'ADD_PROFILE_SUCCEEDED'
export const addProfileSucceeded = createAction(ADD_PROFILE_SUCCEEDED)

export const DELETE_PROFILE = 'DELETE_PROFILE'
export const deleteProfile = createAction(DELETE_PROFILE)
