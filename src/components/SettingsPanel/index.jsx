import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import SettingIcon from '@material-ui/icons/Settings'
import HelpIcon from '@material-ui/icons/Help'
import './style.css'

const drawerWidth = 240

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
  }

  render() {
    const { classes, theme } = this.props
    const isOpen = this.props.uiState.isSettingsOpen

    return (
      <Popover
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
        open={isOpen}
        classes={{
          paper: classes.accountPopoverPaper
        }}
      >
        <List>
          {['This', 'panel is', 'for advanced', 'options'].map(
            (text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            )
          )}
        </List>
        <Divider />
        <List>
          {['More options', 'Help', '??'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <SettingIcon /> : <HelpIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Popover>
    )
  }
}

SettingsPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(SettingsPanel)
