import { combineReducers } from 'redux'

import search from './search'
import uiState from './uiState'
import network from './network'
import profiles from './profiles'

const rootReducer = combineReducers({ search, uiState, network, profiles })

export default rootReducer
