import { createAction } from 'redux-actions'

/**
 * Global state for the application UI
 *
 * @type {string}
 */
export const ADD_ACCOUNT = 'ADD_ACCOUNT'
export const addAccount = createAction(ADD_ACCOUNT)
