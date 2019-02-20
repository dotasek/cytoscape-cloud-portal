import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Popover from '@material-ui/core/Popover'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import SettingIcon from '@material-ui/icons/Settings'
import HelpIcon from '@material-ui/icons/Help'
import './style.css'
import { Avatar } from '@material-ui/core';

const styles = theme => ({
  accountPopover: {
    width: '240px',
    flexShrink: 0
  },
  accountPopoverPaper: {
    width: '240px'
  }
})

class SettingsPanel extends React.Component {
  handleDrawerClose = () => {
    const isOpen = this.props.uiState.isSettingsOpen
    this.props.uiStateActions.setSettingsOpen(!isOpen)
    console.log(this.props)
  }

  handleDeleteProfile = profile => {
    this.props.profilesActions.deleteProfile(profile)
  }

  handleAddProfile = () => {
    this.props.profilesActions.addProfile('X')
  }

  render() {
    const { classes, theme } = this.props
    const isOpen = this.props.uiState.isSettingsOpen
    const anchorEl = this.props.uiState.settingsAnchorEl
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
        <Avatar>FF</Avatar>
        <Divider />
        <List>
          {profiles.map((profile, index) => (
            <ListItem button key={profile}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={profile} />
              <Button
                variant="contained"
                className={classes.button}
                onClick={() => this.handleDeleteProfile(profile)}
                id={profile}
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

SettingsPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(SettingsPanel)
