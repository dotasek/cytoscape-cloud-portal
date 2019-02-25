import { createAction } from 'redux-actions'

export const SELECT_PROFILE_STARTED = 'SELECT_PROFILE_STARTED'
export const selectProfileStarted = createAction(SELECT_PROFILE_STARTED)

export const SELECT_PROFILE_SUCCEEDED = 'SELECT_PROFILE_SUCCEEDED'
export const selectProfileSucceeded = createAction(SELECT_PROFILE_SUCCEEDED)

export const SELECT_PROFILE_FAILED = 'SELECT_PROFILE_FAILED'
export const selectProfileFailed = createAction(SELECT_PROFILE_FAILED)

export const ADD_PROFILE_STARTED = 'ADD_PROFILE_STARTED'
export const addProfileStarted = createAction(ADD_PROFILE_STARTED)

export const ADD_PROFILE_FAILED = 'ADD_PROFILE_FAILED'
export const addProfileFailed = createAction(ADD_PROFILE_FAILED)

export const ADD_PROFILE_SUCCEEDED = 'ADD_PROFILE_SUCCEEDED'
export const addProfileSucceeded = createAction(ADD_PROFILE_SUCCEEDED)

export const DELETE_PROFILE = 'DELETE_PROFILE'
export const deleteProfile = createAction(DELETE_PROFILE)
