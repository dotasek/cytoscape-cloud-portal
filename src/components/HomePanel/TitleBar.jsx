import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import HelpIcon from '@material-ui/icons/Help'
import classNames from 'classnames'
import logo from '../../assets/images/cytoscape-logo.svg'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  hide: {
    display: 'none'
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  logo: {
    height: '2.5em',
    marginRight: '0.7em'
  }
})

class TitleBar extends React.Component {
  handleMenu = () => {
    this.props.uiStateActions.setSettingsOpen(
      !this.props.uiState.isSettingsOpen
    )
  }

  render() {
    const { classes } = this.props
    const open = this.props.uiState.isSettingsOpen

    return (
      <AppBar
        position="fixed"
        color="inherit"
        className={classNames(classes.appBar)}
      >
        <Toolbar disableGutters={true}>
          <img src={logo} className={classes.logo} />
          <Typography variant="h5" color="inherit" className={classes.grow} />
          <div>
            <IconButton
              aria-owns={open ? 'menu-appbar' : undefined}
              aria-haspopup="true"
              color="inherit"
              onClick={this.handleMenu}
            >
              <AccountCircle />
            </IconButton>
            <IconButton
              aria-owns={open ? 'menu-appbar' : undefined}
              aria-haspopup="true"
              color="inherit"
            >
              <HelpIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    )
  }
}

TitleBar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(TitleBar)
