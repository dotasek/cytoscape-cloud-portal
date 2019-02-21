import { combineReducers } from 'redux'

import search from './search'
import uiState from './uiState'
import network from './network'
import profiles from './profiles'
import source from './source'

const rootReducer = combineReducers({
  source,
  search,
  uiState,
  network,
  profiles
})

export default rootReducer
