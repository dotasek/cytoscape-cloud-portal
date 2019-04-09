import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import CloseIcon from '@material-ui/icons/Close'

const styles = theme => ({})

const NDExSnackbar = props => {
  const { classes, ...others } = props

  const handleClose = (event, reason) => {
    props.ndexUiStateActions.setNDExSignInHintOpen(false)
  }

  const handleSignIn = event => {
    console.log('handleSignIn')
    props.ndexUiStateActions.setNDExLoginOpen(true)
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={props.ndexUiState.NDExSignInHintOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        ContentProps={{
          'aria-describedby': 'message-id'
        }}
        message={<span id="message-id">Not signed in to NDEx</span>}
        action={[
          <Button
            key="signIn"
            color="secondary"
            size="small"
            onClick={handleSignIn}
          >
            Sign In
          </Button>,
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    </div>
  )
}

NDExSnackbar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(NDExSnackbar)
