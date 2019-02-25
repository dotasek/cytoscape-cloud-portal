import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import { Avatar } from '@material-ui/core'
import logo from '../../assets/images/cytoscape-logo.svg'
import classNames from 'classnames'

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
  },
  headerLogo: {
    height: '1.4em'
  }
})

class TitleBar extends React.Component {
  handleMenu = event => {
    this.props.uiStateActions.setSettingsOpen(
      {isSettingsOpen: !this.props.uiState.isSettingsOpen,
        anchorEl: event.currentTarget}
    )
  }

  render() {
    const { classes } = this.props
    const open = this.props.uiState.isSettingsOpen
    const selectedProfile = this.props.profiles.selectedProfile
    return (
      <AppBar
        position="fixed"
        color="inherit"
        className={classNames(classes.appBar)}
      >
        <Toolbar disableGutters={true}>
          <img src={logo} className={classes.logo} />
          <Typography variant="h5" color="inherit" className={classes.grow} />
          <div className={classes.grow}>
            <Typography variant="h6" color="inherit">
              NDEx Network Search:
            </Typography>
          </div>
          <Typography variant="body1">
            Pathway Enrichment / Gene Neighborhoods / Keywords
          </Typography>
          <div>
            <IconButton
              aria-owns={open ? 'account-popper' : undefined}
              aria-haspopup="true"
              color="inherit"
              onClick={this.handleMenu}
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
        </Toolbar>
      </AppBar>
    )
  }
}

// TODO: replace this to the actual help page
const HELP_URL = 'https://www.cytoscape.org/'
const GITHUB_URL = 'https://github.com/idekerlab/cytoscape-cloud-portal'
const CY_URL = 'https://www.cytoscape.org/'
const NDEX_URL = 'https://www.ndexbio.org/'
const UCSD_URL =
  'https://medschool.ucsd.edu/som/medicine/research/labs/ideker/Pages/default.aspx'

const openLink = url => {
  window.open(url, '_blank')
}

TitleBar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(TitleBar)
