import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Popover from '@material-ui/core/Popover'
import Link from '@material-ui/core/Link'
import { Link as RouterLink } from 'react-router-dom'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import './style.css'
import { Avatar } from '@material-ui/core'
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline'
import Tooltip from '@material-ui/core/Tooltip'

const styles = theme => ({
  accountPopover: {
    padding: '1em',
    //width: '240px',
    flexShrink: 0
  },
  accountPopoverPaper: {
    //width: '240px'
  },
  ndexAvatar: {},
  ndexSelectedAvatar: {
    width: 80,
    height: 80
  },
  selectedProfile: {
    'align-items': 'center',
    padding: '1em'
  },
  ndexProfileAvatar: {
    display: 'inline-block',
    'vertical-align': 'middle'
  },
  ndexProfileText: {
    display: 'inline-block',
    'padding-left': '1em',
    'padding-right': '1em',
    'vertical-align': 'middle'
  },
  ndexProfilesFooter: {
    padding: '1em'
  },
  link: {
    margin: theme.spacing.unit
  }
})

class NDExProfilesPanel extends React.Component {
  handlePopoverClose = () => {
    const isOpen = this.props.ndexUiState.isProfilesOpen
    this.props.ndexUiStateActions.setProfilesOpen(!isOpen)
  }

  handleDeleteProfile = (event, profile) => {
    event.stopPropagation()
    this.props.profilesActions.deleteProfileStarted(profile)
  }

  handleSelectProfile = profile => {
    this.props.profilesActions.selectProfileStarted(profile)
  }

  handleAddProfile = () => {
    this.props.ndexUiStateActions.setNDExLoginOpen(true)
  }

  render() {
    const MyNetworksLink = props => (
      <RouterLink
        to="/ndexAccount"
        onClick={() => this.handlePopoverClose()}
        {...props}
      />
    )
    const { classes, theme } = this.props

    const anchorEl = this.props.ndexUiState.settingsAnchorEl
    const selectedProfile = this.props.profiles.selectedProfile
    const profiles = this.props.profiles.availableProfiles
    const isOpen = this.props.ndexUiState.isProfilesOpen && profiles.length > 0
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
        disableRestoreFocus={true}
        classes={{
          paper: classes.accountPopoverPaper
        }}
      >
        {selectedProfile && (
          <div className={classes.selectedProfile}>
            <div className={classes.ndexProfileAvatar}>
              {selectedProfile.image ? (
                <Avatar
                  src={selectedProfile.image}
                  className={classes.ndexSelectedAvatar}
                />
              ) : (
                <Avatar className={classes.ndexSelectedAvatar}>
                  {selectedProfile.firstName.substring(0, 1)}
                </Avatar>
              )}
            </div>
            <div className={classes.ndexProfileText}>
              <Typography variant="subtitle1" gutterBottom>
                {selectedProfile.userName}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                {selectedProfile.serverAddress}
              </Typography>
              <Typography variant="caption" gutterBottom>
                Active
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                <Link component={MyNetworksLink}>My Networks</Link>
              </Typography>
            </div>
            <Tooltip title="Remove NDEx Profile" placement="bottom">
              <IconButton
                className={classes.button}
                onClick={event =>
                  this.handleDeleteProfile(event, selectedProfile)
                }
              >
                <RemoveCircleOutline />
              </IconButton>
            </Tooltip>
          </div>
        )}
        {profiles.length > 1 && <Divider />}
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
                <div className={classes.ndexProfileText}>
                  <Typography variant="body1" gutterBottom>
                    {profile.userName}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {profile.serverAddress}
                  </Typography>
                  <Typography variant="caption" gutterBottom>
                    Inactive
                  </Typography>
                </div>
                <Tooltip title="Remove NDEx Profile" placement="bottom">
                <ListItemSecondaryAction>
                  <IconButton
                    aria-label="Delete"
                    onClick={event => this.handleDeleteProfile(event, profile)}
                  >
                    <RemoveCircleOutline />
                  </IconButton>
                </ListItemSecondaryAction>
                </Tooltip>
              </ListItem>
            ))}
        </List>
        <Divider />
        <div className={classes.ndexProfilesFooter} align="center">
          <Button
            color="primary"
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
