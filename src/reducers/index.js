import { combineReducers } from 'redux'

import search from './search'
import uiState from './uiState'
import ndexUiState from './ndexUiState'
import network from './network'
import profiles from './profiles'
import source from './source'
import cyrest from './cyrest'
import ndexImport from './ndexImport'

const rootReducer = combineReducers({
  source,
  search,
  uiState,
  ndexUiState,
  network,
  profiles,
  cyrest,
  ndexImport
})

export default rootReducer
