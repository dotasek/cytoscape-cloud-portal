import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import { Avatar } from '@material-ui/core'
import NDExProfilesPanel from '../NDExProfilesPanel'
import NDExLogin from '../NDExLogin'
import NDExImport from '../NDExImport'
import NDExSnackbar from '../NDExSnackbar';

const styles = theme => ({})

const NDExButton = props => {
  const { classes, ...others } = props

  useEffect(() => {
    //console.log("NDEXButton useEffect.")

    //console.log("window.frame", window.frame)
    //console.log("window.restPort", window.restPort)
    props.ndexUiStateActions.getCyNDExStatus()
    props.profilesActions.importFromLocalStorage()

    if (props.uiState.urlParams.has('suid')) {
      props.ndexUiStateActions.setNDExImportOpen(true)
    }

    return () => {
      //console.log('NDExButton unmounted')
    }
  }, [])

  const handleProfiles = event => {
    props.ndexUiStateActions.setProfilesOpen({
      isProfilesOpen: !props.uiState.isProfilesOpen,
      anchorEl: event.currentTarget
    })
  }

  const profilesOpen = props.ndexUiState.isProfilesOpen
  const selectedProfile = props.profiles.selectedProfile

  return (
    <div>
      <NDExProfilesPanel {...others} />
      <NDExLogin {...others} />
      <NDExImport {...others} />
      <NDExSnackbar {...others} />
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
    </div>
  )
}

NDExButton.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(NDExButton)
