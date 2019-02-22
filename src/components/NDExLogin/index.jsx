import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'

import Typography from '@material-ui/core/Typography';
import './style.css'
import { Avatar } from '@material-ui/core'

const styles = theme => ({
  loginModal: {
    //width: '240px',
  },
  loginModalPaper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none'
  }
})

function getModalStyle() {
  const top = 50 + 0
  const left = 50 + 0

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  }
}

class NDExLogin extends React.Component {
  handleClose = () => {
    this.props.uiStateActions.setNDExLoginOpen(false)
  }

  handleAddProfile = () => {
    this.props.profilesActions.addProfileStarted()
  }

  render() {
    const { classes, theme } = this.props
    const isOpen = this.props.uiState.isNDExLoginOpen
    console.log('rendering modal: ' + isOpen)
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={isOpen}
        onClose={this.handleClose}
      >
        <div style={getModalStyle()} className={classes.loginModalPaper}>
          <Typography variant="h6" id="modal-title">
            Text in a modal
          </Typography>
          <Typography variant="subtitle1" id="simple-modal-description">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
          <Button
            variant="contained"
            className={classes.button}
            onClick={this.handleAddProfile}
          >
            Add Account
          </Button>
        </div>
      </Modal>
    )
  }
}

NDExLogin.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(NDExLogin)
