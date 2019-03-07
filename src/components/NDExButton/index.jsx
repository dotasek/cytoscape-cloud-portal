import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import { Avatar } from '@material-ui/core'
import ProfilesPanel from '../ProfilesPanel'
import NDExLogin from '../NDExLogin'
import NDExImport from '../NDExImport'

const styles = theme => ({})

const NDExButton = props => {
  const { classes, ...others } = props
  const profilesOpen = props.uiState.isProfilesOpen
  const selectedProfile = props.profiles.selectedProfile

  useEffect(() => {
    console.log("NDEXButton useEffect.")

    if (props.uiState.urlParams.has('suid')) {
      props.uiStateActions.setNDExImportOpen(true)
    }

    return () => {
      console.log('NDExButton unmounted')
    }
  }, [])

  const handleProfiles = event => {
    props.uiStateActions.setProfilesOpen({
      isProfilesOpen: !props.uiState.isProfilesOpen,
      anchorEl: event.currentTarget
    })
  }

  return (
    <div>
      <ProfilesPanel {...others} />
      <NDExLogin {...others} />
      <NDExImport {...others} />
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
