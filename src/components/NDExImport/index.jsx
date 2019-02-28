import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
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
  }
})

function getModalStyle() {}

class NDExImport extends React.Component {
  state = {
    author: ''
  }

  handleClose = () => {
    this.props.uiStateActions.setNDExImportOpen(false)
  }

  handleImport = () => {
    this.props.uiStateActions.setNDExImportOpen(false)
  }

  render() {
    const { classes, theme } = this.props
    const isOpen = this.props.uiState.isNDExImportOpen

    console.log('rendering import modal: ' + isOpen)
    return (
      <Dialog
        open={isOpen}
        onClose={this.handleClose}
        aria-labelledby="import-dialog-title"
      >
        <DialogTitle id="simple-dialog-title">Import Network to NDEx</DialogTitle>
        <div style={getModalStyle()} className={classes.loginModalPaper}>
          <form className={classes.container} noValidate>
            <div className="form-group">
              <TextField
                name="author"
                label="Author"
                onChange={this.handleFieldChange}
              />
            </div>
            <div className="form-group">
              <TextField
                name="organism"
                label="Organism"
                onChange={this.handleFieldChange}
              />
            </div>
            {this.state.error && (
              <div ng-if="errors" className="text-danger">
                <br />
                <strong>
                  <span />
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
                onClick={this.handleImport}
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
