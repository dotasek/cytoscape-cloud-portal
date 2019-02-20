import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import HomePanel from '../../components/HomePanel'

import * as searchActions from '../../actions/search'
import * as uiStateActions from '../../actions/uiState'
import * as networkActions from '../../actions/network'
import * as profilesActions from '../../actions/profiles'

const MainContainer = props => <HomePanel {...props} />

function mapStateToProps(state) {
  return {
    search: state.search,
    uiState: state.uiState,
    network: state.network,
    profiles: state.profiles
  }
}

function mapDispatchToProps(dispatch) {
  return {
    searchActions: bindActionCreators(searchActions, dispatch),
    uiStateActions: bindActionCreators(uiStateActions, dispatch),
    networkActions: bindActionCreators(networkActions, dispatch),
    profilesActions: bindActionCreators(profilesActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainContainer)
