import React, { useState, useEffect } from 'react'
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
    outline: 'none',
    padding: '0em 1em 1em 1em'
  },
  importRow: {
    display: 'flex',
    'padding-left': '1em'
  },
  importDoubleColumn: {
    flex: '100%'
  },
  importLeftColumn: {
    flex: '50%'
  },
  importRightColumn: {
    flex: '50%'
  },
  importFooter: {
    'padding-top': '1em'
  },
  importButton: {}
})

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
    suid: undefined,
    saving: false,
    public: false,
    updatable: false,
    overwrite: false,
    success: false,
    shareURL: null,
    errorMessage: null
  })

  useEffect(() => {
    if (props.ndexUiState.isNDExImportOpen) {
      if (!props.ndexImport.importDialogParams) {
        props.ndexImportActions.getSaveToNDExParamsStarted()
      } else {
        setState(props.ndexImport.importDialogParams)
      }
    }
    return () => {
      console.log('NDExImport unmounted')
    }
  }, [props.ndexUiState.isNDExImportOpen, props.ndexImport.importDialogParams])

  const handleClose = () => {
    props.ndexImportActions.saveToNDExCancelled()
    handleSearchClear()
  }

  const handleImport = () => {
    props.ndexImportActions.saveToNDExStarted({
      state: state
    })
    handleSearchClear()
  }

  const handleSearchClear = () => {
    props.history.replace({
      pathname: '/ndexAccount',
      search: ''
    })
  }

  const handleFieldChange = e => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleChangeOverwrite = evt => {
    setState({ ...state, overwrite: evt.target.checked })
    if (evt.target.checked) {
      setState({ ...state, public: false })
    }
  }

  const handleChangeVisibility = evt => {
    //console.log(evt.target.checked)
    setState({ ...state, public: evt.target.checked })
  }

  //console.log('NDExImport dialog instantiated')
  return (
    <Dialog
      open={props.ndexUiState.isNDExImportOpen}
      onClose={handleClose}
      aria-labelledby="import-dialog-title"
    >
      <DialogTitle id="simple-dialog-title">Export Network to NDEx</DialogTitle>
      {props.ndexImport.importDialogParams && (
        <div className={classes.importModalPaper}>
          <form className={classes.container} noValidate>
            <div className={classes.importRow}>
              <div className={classes.importDoubleColumn}>
                <TextField
                  name="name"
                  label="Network Name"
                  fullWidth
                  onChange={handleFieldChange}
                  value={state.name}
                />
              </div>
            </div>
            <div className={classes.importRow}>
              <div className={classes.importLeftColumn}>
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
              <div className={classes.importRightColumn}>
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
                    label="MAKE PUBLIC"
                  />
                </FormGroup>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={handleChangeOverwrite}
                        checked={state.overwrite}
                        disabled={!state.updatable}
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
            <div className={classes.importFooter} align="right">
              <Button
                className={classes.importButton}
                onClick={handleClose}
                type="button"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                className={classes.importButton}
                type="button"
                onClick={handleImport}
                disabled={
                  state.public &&
                  (!state.name || !state.description || !state.version)
                }
              >
                Export
              </Button>
            </div>
          </form>
        </div>
      )}
    </Dialog>
  )
}

NDExImport.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(NDExImport)
