import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import TextField from '@material-ui/core/TextField'
import './style.css'

const styles = theme => ({
  importModal: {
    width: '240px'
  },
  importModalPaper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none'
  },
  importRow: {
    display: 'flex'
  },
  importColumn: {
    flex: '50%',
    padding: '1em 1em 1em 1em'
  },
  importFooter: {
    display: 'flex',
    'justify-content': 'center'
  }
})

function getModalStyle() {}

const NDExImport = props => {
  const { classes } = props
  const hydrate = field => props[field] || ''

  const [state, setState] = useState({
    name: hydrate('name'),
    uuid: hydrate('uuid'),
    author: hydrate('author'),
    organism: hydrate('organism'),
    disease: hydrate('disease'),
    tissue: hydrate('tissue'),
    rightsHolder: hydrate('rightsHolder'),
    version: hydrate('version'),
    reference: hydrate('reference'),
    description: hydrate('description'),
    saveType: hydrate('saveType'),
    saving: false,
    public: false,
    updatable: false,
    overwrite: false,
    success: false,
    shareURL: null,
    errorMessage: null
  })

  const checkPermissions = (profile, saveType) => {
    const main = this
    saveType = saveType || this.state.saveType

    console.log('savetype: ', saveType)
    console.log('checking permissions: ', this.networkData)

    if (
      profile &&
      profile.userId &&
      this.networkData[saveType] &&
      this.networkData[saveType]['uuid']
    ) {
      const uuid = this.networkData[saveType]['uuid']
      //console.log('profile for validation', profile)
      const userId = profile.userId
      const ndexUrl = profile.serverAddress
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization:
          'Basic ' + btoa(profile.userName + ':' + profile.password)
      }
      fetch(ndexUrl + '/v2/user/' + userId + '/permission?networkid=' + uuid, {
        method: 'GET',
        headers: headers
      })
        .then(resp => resp.json())
        .then(resp => {
          console.log('Updatable test response', resp)
          main.setState({
            updatable: resp[uuid] === 'ADMIN' || resp[uuid] === 'WRITE'
          })
        })
        .catch(ex => {
          main.setState({
            updatable: false
          })
        })
    } else {
      this._isMounted &&
        this.setState({
          updatable: false
        })
    }
  }

  const getAttributes = saveType => {
    console.log('getAttribules this.state', this.state)
    saveType = saveType || this.state.saveType
    if (!this.networkData.hasOwnProperty(saveType)) {
      console.log('no save type')
      return {}
    }
    const net = this.networkData[saveType]
    setState({
      author: net['props']['author'] || '',
      organism: net['props']['organism'] || '',
      disease: net['props']['disease'] || '',
      tissue: net['props']['tissue'] || '',
      rightsHolder: net['props']['rightsHolder'] || '',
      version: net['props']['version'] || '',
      reference: net['props']['reference'] || '',
      description: net['props']['description'] || '',
      name: net['name'] || '',
      saveType: saveType
    })
    checkPermissions(this.props.profiles.selectedProfile, saveType)
  }

  const loadData = () => {
    const main = this
    fetch(
      'http://localhost:' + (window.restPort || '1234') + '/cyndex2/v1/status'
    )
      .then(blob => blob.json())
      .then(resp => {
        if (resp.errors.length !== 0) {
          this._isMounted &&
            this.setState({
              component: 'error'
            })
        } else {
          //this.setState({
          //  component: window.cyndexMode || resp.data.widget,
          //  parameters: resp.data.parameters
          //})
          console.log('component config:', resp.data.parameters)
          console.log('_isMounted:' + this._isMounted)
          //main.props.saveType = resp.data.parameters.saveType
          this.setState(resp.data.parameters)
        }
      })
      .catch(exc => {
        //this._isMounted && this.setState({ component: 'cyrestError' })
      })

    fetch(
      'http://localhost:' +
        (window.restPort || '1234') +
        '/cyndex2/v1/networks/current'
    )
      .then(resp => resp.json())
      .then(resp => {
        console.log('cyndex current network: ', resp.data)
        let newData = {
          collection: resp['data']['currentRootNetwork']
        }
        //console.log('resp:', resp)
        if (resp['data']['members']) {
          resp['data']['members'].forEach(member => {
            if (member['suid'] === resp['data']['currentNetworkSuid']) {
              newData['network'] = member
            }
          })
        }
        main.networkData = newData
        console.log('main.networkData', main.networkData)
      })
      .then(() => {
        main.getAttributes()
        main.checkPermissions(this.props.profiles.selectedProfile)
      })
  }

  const handleClose = () => {
    this.props.ndexImportActions.saveToNDExCancelled()
  }

  const handleImport = () => {
    this.props.ndexImportActions.saveToNDExStarted({
      state: this.state,
      networkData: this.networkData
    })
  }

  const handleFieldChange = e => {
    const newState = {
      [e.target.name]: e.target.value
    }
    this.setState(newState)
  }

  const handleChangeOverwrite = evt => {
    this.setState({ overwrite: evt.target.checked })
    if (evt.target.checked) {
      this.setState({ public: false })
    }
  }

  const handleChangeVisibility = evt => {
    //console.log(evt.target.checked)
    this.setState({ public: evt.target.checked })
  }

  //console.log('NDExImport dialog instantiated')
  return (
    <Dialog
      open={props.ndexUiState.isNDExImportOpen}
      onClose={handleClose}
      aria-labelledby="import-dialog-title"
    >
      <DialogTitle id="simple-dialog-title">Save Network to NDEx</DialogTitle>
      <div style={getModalStyle()} className={classes.loginModalPaper}>
        <form className={classes.container} noValidate>
          <div className={classes.importRow}>
            <div className={classes.importColumn}>
              <div className="form-group">
                <TextField
                  name="author"
                  label="Author"
                  value={state.author}
                  onChange={handleFieldChange}
                />
              </div>
              <div className="form-group">
                <TextField
                  name="organism"
                  label="Organism"
                  value={state.organism}
                  onChange={handleFieldChange}
                />
              </div>
              <div className="form-group">
                <TextField
                  name="disease"
                  label="Disease"
                  value={state.disease}
                  onChange={handleFieldChange}
                />
              </div>
              <div className="form-group">
                <TextField
                  name="tissue"
                  label="Tissue"
                  value={state.tissue}
                  onChange={handleFieldChange}
                />
              </div>
              <div className="form-group">
                <TextField
                  name="rightsHolder"
                  label="Rights Holder"
                  value={state.rightsHolder}
                  onChange={handleFieldChange}
                />
              </div>
              <div className="form-group">
                <TextField
                  name="version"
                  label="Version"
                  value={state.version}
                  onChange={handleFieldChange}
                />
              </div>
              <div className="form-group">
                <TextField
                  name="reference"
                  label="Reference"
                  value={state.reference}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
            <div className={classes.importColumn}>
              <div className="form-group">
                <TextField
                  name="description"
                  label="Description"
                  multiline
                  rows="11"
                  onChange={handleFieldChange}
                  value={state.description}
                  required={state.public}
                />
              </div>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleChangeVisibility}
                      checked={state.public}
                    />
                  }
                  label="SAVE AS PUBLIC"
                />
              </FormGroup>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleChangeOverwrite}
                      checked={state.overwrite}
                      disabled={state.updatable}
                    />
                  }
                  label="UPDATE EXISTING NETWORK"
                />
              </FormGroup>
            </div>
          </div>
          <div className={classes.importRow}>
            {state.error && (
              <div ng-if="errors" className="text-danger">
                <br />
                <strong>
                  <span />
                  {state.error}
                </strong>
              </div>
            )}
          </div>
          <div className={classes.importFooter}>
            <TextField
              name="name"
              label="Network Name"
              fullWidth
              onChange={handleFieldChange}
              value={state.name}
            />
            <Button
              variant="contained"
              className={classes.button}
              type="button"
              onClick={handleImport}
              disabled={
                state.public &&
                (!state.name ||
                  !state.description ||
                  !state.version)
              }
            >
              Import
            </Button>
            <Button
              className="btn btn-default"
              onClick={handleClose}
              type="button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}

NDExImport.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(NDExImport)
