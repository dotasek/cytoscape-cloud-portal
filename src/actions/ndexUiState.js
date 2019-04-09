import { createAction } from 'redux-actions'

/**
 * Global state for the application UI
 *
 * @type {string}
 */
export const SET_PROFILES_OPEN = 'SET_PROFILES_OPEN'
export const setProfilesOpen = createAction(SET_PROFILES_OPEN)
export const SET_NDEX_LOGIN_OPEN = 'SET_NDEX_LOGIN_OPEN'
export const setNDExLoginOpen = createAction(SET_NDEX_LOGIN_OPEN)
export const SET_NDEX_IMPORT_OPEN = 'SET_NDEX_IMPORT_OPEN'
export const setNDExImportOpen = createAction(SET_NDEX_IMPORT_OPEN)
export const GET_CYNDEX_STATUS = 'GET_CYNDEX_STATUS'
export const getCyNDExStatus = createAction(GET_CYNDEX_STATUS)

export const SET_NDEX_ACTION_MESSAGE = 'SET_NDEX_ACTION_MESSAGE'
export const setNDExActionMessage = createAction(SET_NDEX_ACTION_MESSAGE)

export const SET_NDEX_SIGN_IN_HINT_OPEN = 'SET_NDEX_SIGN_IN_HINT_OPEN'
export const setNDExSignInHintOpen = createAction(SET_NDEX_SIGN_IN_HINT_OPEN)

export const GET_MY_NETWORKS_STARTED = 'GET_MY_NETWORKS_STARTED'
export const getMyNetworksStarted = createAction(GET_MY_NETWORKS_STARTED)
export const GET_MY_NETWORKS_SUCCEEDED = 'GET_MY_NETWORKS_SUCCEEDED'
export const getMyNetworksSucceeded = createAction(GET_MY_NETWORKS_SUCCEEDED)
export const GET_MY_NETWORKS_FAILED = 'GET_MY_NETWORKS_FAILED'
export const getMyNetworksFailed = createAction(GET_MY_NETWORKS_FAILED)



