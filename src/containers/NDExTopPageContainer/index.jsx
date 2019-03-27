import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import NDExTopPage from '../../components/NDExTopPage'
import { withRouter } from 'react-router-dom'
import * as cyrestActions from '../../actions/cyrest'
import * as searchActions from '../../actions/search'
import * as uiStateActions from '../../actions/uiState'
import * as networkActions from '../../actions/network'
import * as sourceActions from '../../actions/source'
import * as profilesActions from '../../actions/profiles'
import * as ndexImportActions from '../../actions/ndexImport'
import * as ndexUiStateActions from '../../actions/ndexUiState'

const NDExTopPageContainer = props => <NDExTopPage {...props} />
function mapStateToProps(state) {
  return {
    search: state.search,
    uiState: state.uiState,
    network: state.network,
    source: state.source,
    ndexImport: state.ndexImport,
    ndexUiState: state.ndexUiState,
    profiles: state.profiles
  }
}
function mapDispatchToProps(dispatch) {
  return {
    cyrestActions: bindActionCreators(cyrestActions, dispatch),
    searchActions: bindActionCreators(searchActions, dispatch),
    uiStateActions: bindActionCreators(uiStateActions, dispatch),
    networkActions: bindActionCreators(networkActions, dispatch),
    sourceActions: bindActionCreators(sourceActions, dispatch),
    ndexImportActions: bindActionCreators(ndexImportActions, dispatch),
    ndexUiStateActions: bindActionCreators(ndexUiStateActions, dispatch),
    profilesActions: bindActionCreators(profilesActions, dispatch)
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NDExTopPageContainer)
)
