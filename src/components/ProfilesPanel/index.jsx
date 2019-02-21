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
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import './style.css'
import { Avatar } from '@material-ui/core'

const styles = theme => ({
  accountPopover: {
    //width: '240px',
    flexShrink: 0
  },
  accountPopoverPaper: {
    //width: '240px'
  }
})

class ProfilesPanel extends React.Component {
  handleDrawerClose = () => {
    const isOpen = this.props.uiState.isSettingsOpen
    this.props.uiStateActions.setSettingsOpen(!isOpen)
  }

  handleDeleteProfile = profile => {
    this.props.profilesActions.deleteProfile(profile)
  }

  handleSelectProfile = profile => {
    this.props.profilesActions.selectProfile(profile)
  }

  handleAddProfile = () => {
    this.props.profilesActions.addProfile('X')
  }

  handleLogoutProfile = () => {}

  render() {
    const { classes, theme } = this.props
    const isOpen = this.props.uiState.isSettingsOpen
    const anchorEl = this.props.uiState.settingsAnchorEl
    const selectedProfile = this.props.profiles.selectedProfile
    const profiles = this.props.profiles.availableProfiles
    return (
      <Popover
        id="account-popper"
        className={classes.accountPopover}
        onClose={this.handleDrawerClose}
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
        <Avatar src={selectedProfile.image}>
          {selectedProfile.userName.substring(0, 1)}
        </Avatar>
        {selectedProfile.userName}
        {selectedProfile.serverAddress}
        <Divider />
        <List>
          {profiles.map((profile, index) => (
            <ListItem
              button
              key={profile}
              onClick={() => this.handleSelectProfile(profile)}
            >
              <ListItemAvatar>
                <Avatar src={profile.image}>
                  {profile.userName.substring(0, 1)}
                </Avatar>
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
          <Button
            variant="contained"
            className={classes.button}
            onClick={this.handleLogoutProfile}
          >
            Log Out
          </Button>
        </div>
      </Popover>
    )
  }
}

ProfilesPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(ProfilesPanel)
