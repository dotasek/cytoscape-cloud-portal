import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import HelpIcon from '@material-ui/icons/Help'
import classNames from 'classnames'
import logo from '../../assets/images/ndex-logo.svg'
import NDExComponent from '../NDExComponent'
import GeneTextBox from './GeneTextBox'
import Tooltip from '@material-ui/core/Tooltip'

const drawerWidth = 240

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
  menuButton: {
    marginLeft: 12,
    marginRight: 10
  },
  homeButton: {
    height: '2.5em',
    paddingLeft: '0.5em',
    paddingRight: '0.5em'
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
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
  handleMenu = () => {
    this.props.uiStateActions.setSettingsOpen(
      !this.props.uiState.isSettingsOpen
    )
  }

  handleHomeButton = () => {
    this.props.searchActions.clearAll()
    this.props.history.push('/')
  }

  render() {
    const { classes, ...others } = this.props
    const open = this.props.uiState.isSettingsOpen

    return (
      <AppBar
        position="fixed"
        color="inherit"
        className={classNames(classes.appBar, {
          [classes.appBarShift]: open
        })}
      >
        <Toolbar disableGutters={!open}>
          <IconButton
            className={classNames(classes.menuButton, open && classes.hide)}
            color="inherit"
            aria-label="Menu"
            onClick={this.handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Button
            color="inherit"
            aria-label="Home"
            onClick={this.handleHomeButton}
          >
            <img alt="NDEx logo" src={logo} className={classes.homeButton} />
          </Button>
          <Tooltip title="Search by Pathway Enrichment / Gene Neighborhoods / Keywords" aria-label="NDEx_tooltip">
            <div>
              <Typography variant="h6" color="inherit">
                NDEx
              </Typography>
              <Typography variant="body1">Network Search</Typography>
            </div>
          </Tooltip>

          {this.props.search.results === null ? (
            <div />
          ) : (
            <GeneTextBox {...others} />
          )}

          <div className={classes.grow} />
          <div>
            <IconButton
              aria-haspopup="true"
              color="inherit"
              onClick={() => openLink(HELP_URL)}
            >
              <HelpIcon fontSize="default" />
            </IconButton>
          </div>
          <NDExComponent {...others} />
        </Toolbar>
      </AppBar>
    )
  }
}

// TODO: replace this to the actual help page
const HELP_URL = 'https://cytoscape.org/'

const openLink = url => {
  window.open(url, '_blank')
}

TitleBar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(TitleBar)