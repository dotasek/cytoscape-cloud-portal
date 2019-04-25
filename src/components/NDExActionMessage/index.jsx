import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const styles = theme => ({})

const NDExSnackbar = props => {
  const { classes, ...others } = props

  const handleClose = (event, reason) => {
    props.ndexUiStateActions.setNDExActionMessage(undefined)
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={props.ndexUiState.NDExActionMessage != undefined}
        autoHideDuration={6000}
        onClose={handleClose}
        ContentProps={{
          'aria-describedby': 'message-id'
        }}
        message={<span id="message-id">{[props.ndexUiState.NDExActionMessage]}</span>}
        action={[
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
