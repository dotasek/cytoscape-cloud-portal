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

export const DELETE_PROFILE_STARTED = 'DELETE_PROFILE_STARTED'
export const deleteProfileStarted = createAction(DELETE_PROFILE_STARTED)
export const DELETE_PROFILE_SUCCEEDED = 'DELETE_PROFILE_SUCCEEDED'
export const deleteProfileSucceeded = createAction(DELETE_PROFILE_SUCCEEDED)
export const DELETE_PROFILE_FAILED = 'DELETE_PROFILE_FAILED'
export const deleteProfileFailed = createAction(DELETE_PROFILE_FAILED)

export const IMPORT_FROM_LOCAL_STORAGE = 'IMPORT_FROM_LOCAL_STORAGE'
export const importFromLocalStorage = createAction(IMPORT_FROM_LOCAL_STORAGE)
