import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import HomePanel from '../../components/HomePanel'
import { withRouter } from 'react-router-dom'

import * as searchActions from '../../actions/search'
import * as uiStateActions from '../../actions/uiState'
import * as networkActions from '../../actions/network'
import * as sourceActions from '../../actions/source'
import * as cyrestActions from '../../actions/cyrest'
import * as ndexImportActions from '../../actions/ndexImport'
import * as ndexUiStateActions from '../../actions/ndexUiState'
import * as profilesActions from '../../actions/profiles'

const MainContainer = props => <HomePanel {...props} />

function mapStateToProps(state) {
  return {
    search: state.search,
    uiState: state.uiState,
    network: state.network,
    source: state.source,
    ndexImport: state.ndexImport,
    ndexUiState: state.ndexUiState,
    profiles: state.profiles,
    cyrest: state.cyrest
  }
}

function mapDispatchToProps(dispatch) {
  return {
    searchActions: bindActionCreators(searchActions, dispatch),
    uiStateActions: bindActionCreators(uiStateActions, dispatch),
    networkActions: bindActionCreators(networkActions, dispatch),
    sourceActions: bindActionCreators(sourceActions, dispatch),
    cyrestActions: bindActionCreators(cyrestActions, dispatch),
    ndexImportActions: bindActionCreators(ndexImportActions, dispatch),
    ndexUiStateActions: bindActionCreators(ndexUiStateActions, dispatch),
    profilesActions: bindActionCreators(profilesActions, dispatch)
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MainContainer)
)
