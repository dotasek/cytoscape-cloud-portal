import { createAction } from 'redux-actions'

export const SAVE_TO_NDEX_STARTED = 'SAVE_TO_NDEX_STARTED'
export const SAVE_TO_NDEX_SUCCEEDED = 'SAVE_TO_NDEX_SUCCEEDED'
export const SAVE_TO_NDEX_FAILED = 'SAVE_TO_NDEX_FAILED'
export const SAVE_TO_NDEX_CANCELLED = 'SAVE_TO_NDEX_CANCELLED'

export const saveToNDExStarted = createAction(SAVE_TO_NDEX_STARTED)
export const saveToNDExSucceeded = createAction(SAVE_TO_NDEX_SUCCEEDED)
export const saveToNDExFailed = createAction(SAVE_TO_NDEX_FAILED)
export const saveToNDExCancelled = createAction(SAVE_TO_NDEX_CANCELLED)
