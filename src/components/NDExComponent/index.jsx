import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import { Avatar } from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip'
import NDExProfilesPanel from '../NDExProfilesPanel'
import NDExLogin from '../NDExLogin'
import NDExImport from '../NDExImport'
import NDExActionMessage from '../NDExActionMessage'
import NDExSignInHint from '../NDExSignInHint'

const styles = theme => ({})

const NDExComponent = props => {
  const { classes, ...others } = props

  useEffect(() => {
    props.ndexUiStateActions.getCyNDExStatus()
    props.profilesActions.importFromLocalStorage()

    if (props.uiState.urlParams.has('suid')) {
      props.history.push('/ndexAccount')
      props.ndexUiStateActions.setNDExImportOpen(true)
    }

    return () => {
      //console.log('NDExComponent unmounted')
    }
  }, [])

  const handleProfiles = event => {
    if (props.profiles.availableProfiles.length > 0) {
      props.ndexUiStateActions.setProfilesOpen({
        isProfilesOpen: !props.uiState.isProfilesOpen,
        anchorEl: event.currentTarget
      })
    } else {
      props.ndexUiStateActions.setNDExLoginOpen(true)
    }
  }

  const profilesOpen = props.ndexUiState.isProfilesOpen
  const selectedProfile = props.profiles.selectedProfile

  return (
    <div>
      <NDExProfilesPanel {...others} />
      <NDExLogin {...others} />
      <NDExImport {...others} />
      <NDExActionMessage {...others} />
      <NDExSignInHint {...others} />
      <Tooltip
        title={selectedProfile ? 'Manage NDEx Accounts' : 'Sign in to NDEx'}
        placement="bottom"
      >
        <IconButton
          aria-owns={profilesOpen ? 'account-popper' : undefined}
          aria-haspopup="true"
          color="inherit"
          onClick={handleProfiles}
        >
          {selectedProfile ? (
            <div>
              {selectedProfile.image ? (
                <Avatar src={selectedProfile.image} />
              ) : (
                <Avatar>{selectedProfile.firstName.substring(0, 1)}</Avatar>
              )}
            </div>
          ) : (
            <AccountCircle />
          )}
        </IconButton>
      </Tooltip>
    </div>
  )
}

NDExComponent.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(NDExComponent)
