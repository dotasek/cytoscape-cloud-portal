import { handleActions } from 'redux-actions'
import { addAccount } from '../actions/accounts'

const DEF_STATE = {}

const accounts = handleActions(
  {
    [addAccount]: (state, payload) => {
      console.log('addAccount = ', payload.payload)
      return {
        ...state
      }
    }
  },
  DEF_STATE
)

export default accounts
