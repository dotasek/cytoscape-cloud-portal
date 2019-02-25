import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import TextField from '@material-ui/core/TextField'
import './style.css'

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
  state = {
    userName: '',
    password: 'password',
    serverAddress: '',
    error: null
  }

  handleClose = () => {
    this.props.uiStateActions.setNDExLoginOpen(false)
  }

  handleAddProfile = event => {
    this.setState({ error: null })

    const profile = Object.assign({}, this.state)
    //const { addProfileStarted } = this.props
    if (profile.serverAddress === '')
      profile.serverAddress = 'http://ndexbio.org'
    if (profile.serverAddress.endsWith('/'))
      profile.serverAddress = profile.serverAddress.slice(0, -1)

    if (profile.serverAddress.lastIndexOf('http://', 0) !== 0) {
      profile.serverAddress = 'http://' + profile.serverAddress
    }

    if (
      (profile.userName === '' && profile.password !== '') ||
      (profile.userName !== '' && profile.password === '')
    ) {
      const missingVal = profile.userName === '' ? 'username' : 'password'
      this.setState({ error: 'Must provide a ' + missingVal })
      return
    }
    const filtered = this.props.profiles.availableProfiles.filter(
      p =>
        p.serverAddress === profile.serverAddress &&
        p.userName === profile.userName
    )

    if (filtered.length !== 0) {
      this.setState({ error: 'The profile is already logged in.' })
    } else if (profile.userName !== '') {
      fetch(profile.serverAddress + '/v2/user?valid=true', {
        headers: new Headers({
          Authorization:
            'Basic ' + btoa(profile.userName + ':' + profile.password)
        })
      })
        .then(response => response.json())
        .then(response => {
          if (response.errorCode) {
            throw Error(response.message)
          }
          console.log(response)
          return response
        })
        .then(blob => {
          //onPageActivate('select')
          const newProfile = Object.assign(profile, {
            userId: blob.externalId,
            firstName: blob.firstName,
            image: blob.image
          })
          this.props.profilesActions.addProfileStarted(newProfile)
        })
        .catch(error => {
          var message = error.message
          if (error.message === 'Failed to fetch')
            message =
              'Could not connect to NDEx server ' + profile.serverAddress
          console.log(message)
          this.setState({ error: message })
        })
    } else {
      // adding anonymous account.
      //onPageActivate('select')
      this.props.profilesActions.addProfileStarted(profile)
    }
  }

  handleNameChange = event => {
    this.setState({ userName: event.target.value })
  }

  handlePasswordChange = event => {
    this.setState({ password: event.target.value })
  }

  handleServerChange = event => {
    this.setState({ serverAddress: event.target.value })
  }

  render() {
    const { classes, theme } = this.props
    const isOpen = this.props.uiState.isNDExLoginOpen
    const defaultServer = this.state.server
    console.log('rendering modal: ' + isOpen)
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={isOpen}
        onClose={this.handleClose}
      >
        <div style={getModalStyle()} className={classes.loginModalPaper}>
          <form className={classes.container} noValidate>
            <div className="form-group">
              <TextField
                name="userName"
                label="User Name"
                required
                onChange={this.handleNameChange}
              />
            </div>
            <div className="form-group">
              <TextField
                name="password"
                type="password"
                className={classes.textField}
                placeholder="Password"
                required
                title=""
                autoComplete="password"
                onChange={this.handlePasswordChange}
              />
            </div>
            <div className="form-group">
              <TextField
                name="server"
                label="NDEx Server Address"
                onChange={this.handleServerChange}
              />
            </div>
            {this.state.error && (
              <div
                ng-if="errors"
                className="text-danger"
                // style='word-wrap:break-word'
              >
                <br />
                <strong>
                  <span
                  // style="font-size: 1.1em" ng-bind-html="errors"
                  />
                  {this.state.error}
                </strong>
              </div>
            )}

            <div
              className="AlignRight"
              // style="margin-top:1em"
            >
              <Button
                variant="contained"
                className={classes.button}
                type="button"
                onClick={this.handleAddProfile}
              >
                Confirm
              </Button>
              <Button
                className="btn btn-default"
                onClick={this.handleClose}
                type="button"
              >
                Cancel
              </Button>
            </div>
          </form>
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
