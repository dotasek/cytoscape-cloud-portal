import React from 'react'
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

class NDExImport extends React.Component {
  _isMounted = false

  constructor(props) {
    super(props)
    this.loadData()
    this.state = {
      name: this.hydrate('name'),
      uuid: this.hydrate('uuid'),
      author: this.hydrate('author'),
      organism: this.hydrate('organism'),
      disease: this.hydrate('disease'),
      tissue: this.hydrate('tissue'),
      rightsHolder: this.hydrate('rightsHolder'),
      version: this.hydrate('version'),
      reference: this.hydrate('reference'),
      description: this.hydrate('description'),
      saveType: this.hydrate('saveType'),
      saving: false,
      public: false,
      updatable: false,
      overwrite: false,
      success: false,
      shareURL: null,
      errorMessage: null
    }
    this.networkData = {}
  }

  hydrate = field => this.props[field] || ''

  componentDidMount() {
    this._isMounted = true
    this.loadData()
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  checkPermissions = (profile, saveType) => {
    const main = this
    saveType = saveType || this.state.saveType
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

  getAttributes = saveType => {
    //console.log('networkData', this.networkData)
    saveType = saveType || this.state.saveType
    if (!this.networkData.hasOwnProperty(saveType)) {
      console.log('no save type')
      return {}
    }
    const net = this.networkData[saveType]
    this._isMounted &&
      this.setState({
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
    this.checkPermissions(this.props.profiles.selectedProfile, saveType)
  }

  loadComponentConfig() {
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
          this._isMounted && this.setState(resp.data.parameters)
        }
      })
      .catch(exc => {
        this._isMounted && this.setState({ component: 'cyrestError' })
      })
  }

  loadData() {
    this.loadComponentConfig()
    //('loadData')
    const main = this
    fetch(
      'http://localhost:' +
        (window.restPort || '1234') +
        '/cyndex2/v1/networks/current'
    )
      .then(resp => resp.json())
      .then(resp => {
        console.log('component config', resp.data)
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

  handleClose = () => {
    this.props.ndexImportActions.saveToNDExCancelled()
  }

  handleImport = () => {
    this.props.ndexImportActions.saveToNDExStarted({
      state: this.state,
      networkData: this.networkData
    })
  }

  handleFieldChange = e => {
    const newState = {
      [e.target.name]: e.target.value
    }
    this.setState(newState)
  }

  handleChangeOverwrite = evt => {
    this.setState({ overwrite: evt.target.checked })
    if (evt.target.checked) {
      this.setState({ public: false })
    }
  }

  handleChangeVisibility = evt => {
    //console.log(evt.target.checked)
    this.setState({ public: evt.target.checked })
  }

  render() {
    const { classes, theme } = this.props
    const isOpen = this.props.ndexUiState.isNDExImportOpen
    //console.log('NDExImport dialog instantiated')
    return (
      <Dialog
        open={isOpen}
        onClose={this.handleClose}
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
                    value={this.state.author}
                    onChange={this.handleFieldChange}
                  />
                </div>
                <div className="form-group">
                  <TextField
                    name="organism"
                    label="Organism"
                    value={this.state.organism}
                    onChange={this.handleFieldChange}
                  />
                </div>
                <div className="form-group">
                  <TextField
                    name="disease"
                    label="Disease"
                    value={this.state.disease}
                    onChange={this.handleFieldChange}
                  />
                </div>
                <div className="form-group">
                  <TextField
                    name="tissue"
                    label="Tissue"
                    value={this.state.tissue}
                    onChange={this.handleFieldChange}
                  />
                </div>
                <div className="form-group">
                  <TextField
                    name="rightsHolder"
                    label="Rights Holder"
                    value={this.state.rightsHolder}
                    onChange={this.handleFieldChange}
                  />
                </div>
                <div className="form-group">
                  <TextField
                    name="version"
                    label="Version"
                    value={this.state.version}
                    onChange={this.handleFieldChange}
                  />
                </div>
                <div className="form-group">
                  <TextField
                    name="reference"
                    label="Reference"
                    value={this.state.reference}
                    onChange={this.handleFieldChange}
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
                    onChange={this.handleFieldChange}
                    value={this.state.description}
                    required={this.state.public}
                  />
                </div>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={this.handleChangeVisibility}
                        checked={this.state.public}
                      />
                    }
                    label="SAVE AS PUBLIC"
                  />
                </FormGroup>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={this.handleChangeOverwrite}
                        checked={this.state.overwrite}
                        disabled={this.state.updatable}
                      />
                    }
                    label="UPDATE EXISTING NETWORK"
                  />
                </FormGroup>
              </div>
            </div>
            <div className={classes.importRow}>
              {this.state.error && (
                <div ng-if="errors" className="text-danger">
                  <br />
                  <strong>
                    <span />
                    {this.state.error}
                  </strong>
                </div>
              )}
            </div>
            <div className={classes.importFooter}>
              <TextField
                name="name"
                label="Network Name"
                fullWidth
                onChange={this.handleFieldChange}
                value={this.state.name}
              />
              <Button
                variant="contained"
                className={classes.button}
                type="button"
                onClick={this.handleImport}
                disabled={
                  this.state.public &&
                  (!this.state.name ||
                    !this.state.description ||
                    !this.state.version)
                }
              >
                Import
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
      </Dialog>
    )
  }
}

NDExImport.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(NDExImport)
