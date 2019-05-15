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
      return
    }

    if (props.ndexUiState.myNetworks == undefined) {
      props.ndexUiStateActions.getMyNetworksStarted()
    } else {
      if (props.ndexUiState.currentNetworkUUID != props.network.uuid) {
        handleFetchNetwork(props.ndexUiState.currentNetworkUUID)
      } else {
        const ndexNetwork = props.ndexUiState.myNetworks.filter(
          value => value.externalId == props.ndexUiState.currentNetworkUUID
        )
        if (ndexNetwork.length > 0) {
          console.log('Network exists; compare timestamps')
        } else {
          console.log('Network doesnt exist, destroy it')
        }
      }
    }
    return () => {
      props.networkActions.networkClear()
    }
  }, [
    props.profiles.selectedProfile,
    props.ndexUiState.myNetworks,
    props.ndexUiState.currentNetworkUUID
  ])

  const NETWORK_SIZE_TH = 5000

  const handleFetchNetwork = (networkUUID, nodeCount, edgeCount) => {
    props.networkActions.setNetworkSize({
      nodeCount,
      edgeCount
    })

    const networkSize = nodeCount + edgeCount

    // Do not load if size is too big to render!
    if (networkSize > NETWORK_SIZE_TH) {
      return
    }

    props.cyrestActions.queryAvailable()
    props.networkActions.ndexNetworkFetchStarted({
      networkUUID: networkUUID
    })
  }

  const handleSelectNetwork = (networkUUID, nodeCount, edgeCount) => {
    props.ndexUiStateActions.setCurrentNetwork({
      currentNetworkUUID: networkUUID
    })
  }

  const handleImportNetwork = () => {
    props.ndexImportActions.importFromNDExStarted(props.network.ndexData)
  }

  const renderNetworkListItem = (networkEntry, classes) => {
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
        onClick={val => handleSelectNetwork(externalId, nodeCount, edgeCount)}
        selected={externalId == props.ndexUiState.currentNetworkUUID}
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
      <NetworkList renderNetworkListItem={renderNetworkListItem} {...props} />
      <NetworkView
        handleImportNetwork={handleImportNetwork}
        showHighlighter={false}
        {...props}
      />
    </Split>
  )
}
export default MyNetworks
