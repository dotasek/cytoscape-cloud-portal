import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import MenuList from '@material-ui/core/MenuList'

import './style.css'
import Sorter from './Sorter'

const styles = theme => ({
  inline: {
    display: 'inline'
  },
  subtitle: {
    marginLeft: '1em',
    marginTop: '0.5em'
  },
  networkAvatar: {
    margin: 5,
    color: '#fff',
    backgroundColor: '#FAFAFA'
  },
  menuItem: {
    '&:focus': {
      backgroundColor: 'rgba(230,230,230,0.6)'
    }
  },
  menuText: {
    '&:focus': {}
  },
  secondary: {
    width: '15em',
    display: 'flex',
    alignItems: 'center',
    padding: '0.2em'
  },
  plot: {
    width: '80%',
    background: 'teal'
  }
})

const NetworkList = props => {
  const { classes, hits, renderNetworkListItem, network, search } = props

  if (!hits) {
    return <div className="network-list-wrapper" />
  }

  const querySize = search && search.results ? search.results.genes.size : 0
  console.log('LIST val:::', querySize, props)

  return (
    <div className="network-list-wrapper">
      <div className="network-list">
        <MenuList>
          {hits.map(entry => renderNetworkListItem(querySize, entry, classes))}
        </MenuList>
      </div>
    </div>
  )
}

export default withStyles(styles)(NetworkList)
