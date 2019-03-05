import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TopPage from '../../components/TopPage'
import { withRouter } from 'react-router-dom'
import * as searchActions from '../../actions/search'
import * as uiStateActions from '../../actions/uiState'
import * as networkActions from '../../actions/network'
import * as sourceActions from '../../actions/source'
import * as profilesActions from '../../actions/profiles'
import * as ndexImportActions from '../../actions/ndexImport'

const TopPageContainer = props => <TopPage {...props} />
function mapStateToProps(state) {
  return {
    search: state.search,
    uiState: state.uiState,
    network: state.network,
    source: state.source,
    profiles: state.profiles,
    ndexImport: state.ndexImport
  }
}
function mapDispatchToProps(dispatch) {
  return {
    searchActions: bindActionCreators(searchActions, dispatch),
    uiStateActions: bindActionCreators(uiStateActions, dispatch),
    networkActions: bindActionCreators(networkActions, dispatch),
    sourceActions: bindActionCreators(sourceActions, dispatch),
    profilesActions: bindActionCreators(profilesActions, dispatch),
    ndexImportActions: bindActionCreators(ndexImportActions, dispatch)
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TopPageContainer)
)
