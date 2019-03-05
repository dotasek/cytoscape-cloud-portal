import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import HomePanel from '../../components/HomePanel'
import { withRouter } from 'react-router-dom'

import * as searchActions from '../../actions/search'
import * as uiStateActions from '../../actions/uiState'
import * as networkActions from '../../actions/network'
import * as profilesActions from '../../actions/profiles'
import * as sourceActions from '../../actions/source'
import * as cyrestActions from '../../actions/cyrest'
import * as ndexImportActions from '../../actions/ndexImport'

const MainContainer = props => <HomePanel {...props} />

function mapStateToProps(state) {
  return {
    search: state.search,
    uiState: state.uiState,
    profiles: state.profiles,
    network: state.network,
    source: state.source,
    ndexImport: state.ndexImport
  }
}

function mapDispatchToProps(dispatch) {
  return {
    searchActions: bindActionCreators(searchActions, dispatch),
    uiStateActions: bindActionCreators(uiStateActions, dispatch),
    profilesActions: bindActionCreators(profilesActions, dispatch),
    networkActions: bindActionCreators(networkActions, dispatch),
    sourceActions: bindActionCreators(sourceActions, dispatch),
    cyrestActions: bindActionCreators(cyrestActions, dispatch),
    ndexImportActions: bindActionCreators(ndexImportActions, dispatch)
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MainContainer)
)
