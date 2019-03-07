import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import { Avatar } from '@material-ui/core'

const styles = theme => ({})

const NDExButton = props => {
  const { classes } = props
  const profilesOpen = props.uiState.isProfilesOpen
  const selectedProfile = props.profiles.selectedProfile

  const handleProfiles = event => {
    props.uiStateActions.setProfilesOpen({
      isProfilesOpen: !props.uiState.isProfilesOpen,
      anchorEl: event.currentTarget
    })
  }

  return (
    <div>
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
