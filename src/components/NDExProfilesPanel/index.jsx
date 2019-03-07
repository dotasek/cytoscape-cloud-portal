import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Popover from '@material-ui/core/Popover'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import './style.css'
import { Avatar } from '@material-ui/core'
import defaultProfileImage from '../../assets/images/default-profile.png'

const styles = theme => ({
  accountPopover: {
    //width: '240px',
    flexShrink: 0
  },
  accountPopoverPaper: {
    //width: '240px'
  }
})

class NDExProfilesPanel extends React.Component {
  handlePopoverClose = () => {
    const isOpen = this.props.ndexUiState.isProfilesOpen
    this.props.ndexUiStateActions.setProfilesOpen(!isOpen)
  }

  handleDeleteProfile = profile => {
    this.props.profilesActions.deleteProfile(profile)
  }

  handleSelectProfile = profile => {
    this.props.profilesActions.selectProfileStarted(profile)
  }

  handleAddProfile = () => {
    this.props.ndexUiStateActions.setNDExLoginOpen(true)
  }

  render() {
    const { classes, theme } = this.props
    const isOpen = this.props.ndexUiState.isProfilesOpen
    const anchorEl = this.props.ndexUiState.settingsAnchorEl
    const selectedProfile = this.props.profiles.selectedProfile
    const profiles = this.props.profiles.availableProfiles
    return (
      <Popover
        id="account-popper"
        className={classes.accountPopover}
        onClose={this.handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        anchorEl={anchorEl}
        open={isOpen}
        classes={{
          paper: classes.accountPopoverPaper
        }}
      >
        {selectedProfile && (
          <div>
            {selectedProfile.image ? (
              <Avatar src={selectedProfile.image} />
            ) : (
              <Avatar>{selectedProfile.firstName.substring(0, 1)}</Avatar>
            )}
            {selectedProfile.userName}
            {selectedProfile.serverAddress}
            <Button
              variant="contained"
              className={classes.button}
              onClick={() => this.handleDeleteProfile(selectedProfile)}
            >
              Remove
            </Button>
          </div>
        )}
        <Divider />
        <List>
          {profiles
            .filter(p => p !== selectedProfile)
            .map((profile, index) => (
              <ListItem
                button
                key={profile.userId + '@' + profile.serverAddress}
                onClick={() => this.handleSelectProfile(profile)}
              >
                <ListItemAvatar>
                  {profile.image ? (
                    <Avatar src={profile.image} />
                  ) : (
                    <Avatar>{profile.firstName.substring(0, 1)}</Avatar>
                  )}
                </ListItemAvatar>
                <ListItemText primary={profile.userName} />
                {profile.serverAddress}
                <Button
                  variant="contained"
                  className={classes.button}
                  onClick={() => this.handleDeleteProfile(profile)}
                >
                  Remove
                </Button>
              </ListItem>
            ))}
        </List>
        <Divider />
        <div>
          <Button
            variant="contained"
            className={classes.button}
            onClick={this.handleAddProfile}
          >
            Add Account
          </Button>
        </div>
      </Popover>
    )
  }
}

NDExProfilesPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(NDExProfilesPanel)
