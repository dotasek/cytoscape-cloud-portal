import React from 'react'
import './style.css'

import Split from 'react-split'
import NetworkView from './NetworkView'
import NetworkList from './NetworkList'

import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'

import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

import MenuItem from '@material-ui/core/MenuItem'

import * as cyRESTApi from '../../../api/cyrest'
import Tooltip from '@material-ui/core/Tooltip'

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

  const handleFetch = (networkUUID, networkName, nodeCount, edgeCount, hitGenes) => {
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

  const renderNetworkListItem = (networkEntry, classes) => {
    const {
      description,
      networkUUID,
      percentOverlap,
      nodes,
      edges,
      imageURL,
      hitGenes
    } = networkEntry

    return (
      <MenuItem
        className={classes.menuItem}
        alignItems="flex-start"
        key={networkUUID}
        onClick={val =>
          handleFetch(networkUUID, description, nodes, edges, hitGenes)
        }
      >
        <ListItemAvatar>
          <Avatar className={classes.networkAvatar} src={imageURL} />
        </ListItemAvatar>
        <ListItemText
          className={classes.menuText}
          primary={description}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                className={classes.inline}
                color="textPrimary"
              >
                {'Nodes: ' + nodes + ', Edges: ' + edges}
              </Typography>
              <Tooltip
                title={percentOverlap + '% overlap of network by search genes.'}
                placement="right"
                key={networkUUID}
              >
                <div
                  style={{
                    background: 'teal',
                    color: 'white',
                    height: '1.5em',
                    width: percentOverlap * 3 + 'px'
                  }}
                >
                  <Typography variant="body2" style={{ color: '#AAAAAA' }}>
                    {percentOverlap + '%'}
                  </Typography>
                </div>
              </Tooltip>
            </React.Fragment>
          }
        />

        <ListItemSecondaryAction className={classes.secondary} />
      </MenuItem>
    )
  }

  return (
    <Split sizes={[50, 50]} gutterSize={7} className="ndex-base">
      <NetworkList renderNetworkListItem={renderNetworkListItem} {...props} />
      <NetworkView handleImportNetwork={handleImportNetwork} showHighlighter={true} {...props} />
    </Split>
  )
}

export default Ndex
