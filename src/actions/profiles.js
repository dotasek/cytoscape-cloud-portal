import { createAction } from 'redux-actions'

export const SELECT_PROFILE = 'SELECT_PROFILE'
export const selectProfile = createAction(SELECT_PROFILE)

export const ADD_PROFILE = 'ADD_PROFILE'
export const addProfile = createAction(ADD_PROFILE)

export const DELETE_PROFILE = 'DELETE_PROFILE'
export const deleteProfile = createAction(DELETE_PROFILE)
