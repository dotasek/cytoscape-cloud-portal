import React, { useEffect } from 'react'
import './style.css'

import Split from 'react-split'
import NetworkView from '../../Results/Ndex/NetworkView'
import NetworkList from '../../Results/Ndex/NetworkList'

import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'

import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

import * as cyRESTApi from '../../../api/cyrest'
import MenuItem from '@material-ui/core/MenuItem'
import no_image from '../../../assets/images/no_image.png'
/**
 * Top page for the application
 *
 * @param props
 * @returns {*}
 * @constructor
 */

const MyNetworks = props => {
  useEffect(() => {
    if (!props.profiles.selectedProfile) {
      props.history.replace('/')
    }
  }, [props.profiles.selectedProfile])

  const NETWORK_SIZE_TH = 5000

  const handleErrors = res => {
    console.log('Calling!!', res)
    if (res !== undefined) {
      return true
    }
    return false
  }

  const checkCytoscapeConnection = props => {
    console.log(props.uiState.urlParams)
    cyRESTApi
      .status(
        props.uiState.urlParams.has('cyrestport')
          ? props.uiState.urlParams.get('cyrestport')
          : 1234
      )
      .catch(e => {
        throw Error(e)
      })
      .then(res => handleErrors(res))
      .then(running => {
        props.uiStateActions.setCytoscapeStatus(true)
      })
      .catch(error => {
        props.uiStateActions.setCytoscapeStatus(false)
      })
  }

  const handleFetch = (networkUUID, nodeCount, edgeCount) => {
    props.networkActions.setNetworkSize({
      nodeCount,
      edgeCount
    })

    const networkSize = nodeCount + edgeCount

    // Do not load if size is too big to render!
    if (networkSize > NETWORK_SIZE_TH) {
      return
    }

    checkCytoscapeConnection(props)
    props.networkActions.ndexNetworkFetchStarted({
      networkUUID: networkUUID
    })
  }

  const getListItem = (networkEntry, classes) => {
    const {
      name,
      externalId,
      percentOverlap,
      nodeCount,
      edgeCount
    } = networkEntry

    const imageURL =
      'http://v1.storage.cytoscape.io/images/' + externalId + '.png'

    return (
      <MenuItem
        className={classes.menuItem}
        alignItems="flex-start"
        key={externalId}
        onClick={val => handleFetch(externalId, nodeCount, edgeCount)}
      >
        <ListItemAvatar>
          <Avatar
            className={classes.networkAvatar}
            src={imageURL}
            onError={err => {
              if (err.target.src === no_image) {
                err.target.src = no_image
                err.target.onError = null
              } else {
                err.target.src = no_image
                err.target.onError = "this.src=''"
              }
            }}
          />
        </ListItemAvatar>
        <ListItemText
          className={classes.menuText}
          primary={name}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                className={classes.inline}
                color="textPrimary"
              >
                {'Nodes: ' + nodeCount + ', Edges: ' + edgeCount}
              </Typography>
            </React.Fragment>
          }
        />
      </MenuItem>
    )
  }

  return (
    <Split sizes={[50, 50]} gutterSize={7} className="ndex-base">
      <NetworkList getListItem={getListItem} {...props} />
      <NetworkView {...props} />
    </Split>
  )
}
export default MyNetworks
