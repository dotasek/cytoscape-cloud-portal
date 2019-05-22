import React from 'react'
import './style.css'

import Split from 'react-split'
import NetworkView from './NetworkView'
import NetworkList from './NetworkList'

import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'

import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

import * as cyRESTApi from '../../../api/cyrest'
import { ListItem } from '@material-ui/core'

const NETWORK_SIZE_TH = 5000

/**
 * Top page for the application
 *
 * @param props
 * @returns {*}
 * @constructor
 */
const Ndex = props => {
  const geneList = props.search.queryList

  const sourceUUID = props.sourceUUID

  const id = props.search.results.jobId

  const handleFetch = (
    networkUUID,
    networkName,
    nodeCount,
    edgeCount,
    hitGenes
  ) => {
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
    // Reset the UI state (hilight)
    props.uiStateActions.setHighlights(false)

    // Reset selection
    props.searchActions.setSelectedGenes([])

    props.networkActions.networkFetchStarted({
      id,
      sourceUUID,
      networkUUID,
      networkName,
      geneList,
      hitGenes
    })
  }

  const handleImportNetwork = () => {
    props.cyrestActions.importNetworkStarted(props.network.originalCX)
  }

  const renderNetworkListItem = (querySize, networkEntry, classes) => {
    const {
      description,
      networkUUID,
      nodes,
      edges,
      imageURL,
      hitGenes
    } = networkEntry

    return (
      <ListItem
        button
        className={classes.menuItem}
        key={networkUUID}
        onClick={val =>
          handleFetch(networkUUID, description, nodes, edges, hitGenes)
        }
      >
        <ListItemAvatar>
          <Avatar className={classes.networkAvatar} src={imageURL} />
        </ListItemAvatar>
        <ListItemText
          primary={description}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                className={classes.inline}
              >
                {'Nodes: ' + nodes + ', Edges: ' + edges}
              </Typography>
              
              {hitGenes && ('  Hit/Query = ' + hitGenes.length + '/' + querySize)} 
            </React.Fragment>
          }
        />
      </ListItem>
    )
  }

  return (
    <Split sizes={[35, 65]} gutterSize={7} className="ndex-base">
      <NetworkList renderNetworkListItem={renderNetworkListItem} {...props} />
      <NetworkView
        handleImportNetwork={handleImportNetwork}
        showHighlighter={true}
        {...props}
      />
    </Split>
  )
}

export default Ndex
