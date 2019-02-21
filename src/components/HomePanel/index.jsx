import React, { useEffect } from 'react'
import './style.css'
import InputPanel from '../InputPanel'
import Results from '../Results'
import TitleBar from './TitleBar'
import ProfilesPanel from '../ProfilesPanel'

import CssBaseline from '@material-ui/core/CssBaseline'
import { withStyles } from '@material-ui/core/styles'

import classNames from 'classnames'
import StartPanel from './StartPanel'
import NDExLogin from '../NDExLogin'

const styles = theme => ({
  root: {
    display: 'flex',
    height: '100vmin'
  },
  drawerHeader: {
    display: 'flex',
    padding: '0 8px',
    alignItems: 'center',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: 0
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
})

/**
 * Top page for the application
 *
 * @param props
 * @returns {*}
 * @constructor
 */
const HomePanel = props => {
  const { classes, ...others } = props

  useEffect(() => {
    props.sourceActions.findSourceStarted()
    console.log('Base component mounted:')
    return () => {
      console.log('Page unmounted')
    }
  }, [])

  const open = props.uiState.isSettingsOpen

  return (
    <div className={classes.root}>
      <CssBaseline />
      <TitleBar {...others} />
      <ProfilesPanel {...others} />
      <NDExLogin {...others} />
      <div
        className={classNames(classes.content, {
          [classes.contentShift]: open
        })}
      />

      {getMainContents(others)}
    </div>
  )
}

const getMainContents = props => {
  if (props.search.results === null) {
    return <StartPanel {...props} />
  } else {
    return (
      <div className="container">
        <InputPanel className="input" {...props} />
        <Results className="results" {...props} />
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(HomePanel)
