import { createAction } from 'redux-actions'

/**
 * Global state for the application UI
 *
 * @type {string}
 */
export const SET_SETTINGS_OPEN = 'SET_SETTINGS_OPEN'
export const setSettingsOpen = createAction(SET_SETTINGS_OPEN)

export const SET_CYTOSCAPE_STATUS = 'SET_CYTOSCAPE_STATUS'
export const setCytoscapeStatus = createAction(SET_CYTOSCAPE_STATUS)

export const SET_SERVICES_LIST_OPEN = 'SET_SERVICES_LIST_OPEN'
export const setServicesListOpen = createAction(SET_SERVICES_LIST_OPEN)

export const SET_HIGHLIGHTS = 'SET_HIGHLIGHTS'
export const setHighlights = createAction(SET_HIGHLIGHTS)
