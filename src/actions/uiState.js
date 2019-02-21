import { createAction } from 'redux-actions'

/**
 * Global state for the application UI
 *
 * @type {string}
 */
export const SET_SETTINGS_OPEN = 'SET_SETTINGS_OPEN'
export const setSettingsOpen = createAction(SET_SETTINGS_OPEN)

export const SET_NDEX_LOGIN_OPEN = 'SET_NDEX_LOGIN_OPEN'
export const setNDExLoginOpen = createAction(SET_NDEX_LOGIN_OPEN)
