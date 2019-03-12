import React, { useEffect, useState } from 'react'
import CytoscapeComponent from 'react-cytoscapejs'

import './style.css'
import Warning from "./Warning";
let cyInstance = null

const BASE_STYLE = { width: '100%', height: '100%', background: '#222233' }

const PRESET_LAYOUT = {
  name: 'preset',
  padding: 6
}

const COCENTRIC_LAYOUT = {
  name: 'concentric',
  padding: 6
}

const COSE_SETTING = {
  name: 'cose',
  padding: 6,
  nodeRepulsion: function(node) {
    return 10080000
  },
  nodeOverlap: 400000,
  idealEdgeLength: function(edge) {
    return 10
  }
}

/**
 *
 * Simple wrapper for cytoscape.js react component
 *
 * @param props
 * @returns {*}
 * @constructor
 */
const CytoscapeViewer = props => {
  useEffect(() => {
    if (cyInstance === undefined || cyInstance === null) {
      return
    }
    console.log('This should run only once:  CyViewer Mounted:', cyInstance)

    cyInstance.on('tap', function(event) {
      try {
        const target = event.target
        if (target === cyInstance) {
          props.networkActions.deselectAll()
          console.log('UNSELECT')
        }
      } catch (e) {
        console.warn(e)
      }
    })

    cyInstance.on('tap', 'node', function() {
      try {
        const selected = this.data()
        props.networkActions.selectNode(selected)
      } catch (e) {
        console.warn(e)
      }
    })

    cyInstance.on('tap', 'edge', function() {
      try {
        const selected = this.data()
        props.networkActions.selectEdge(selected)
      } catch (e) {
        console.warn(e)
      }
    })

    return () => {
      console.log('unmount')
    }
  }, [])

  const numObjects = props.network.nodeCount + props.network.edgeCount
  if (numObjects > 5000) {
    return <Warning />
  }

  const cyjs = props.network.network
  const selectedGenes = props.search.selectedGenes

  if (cyjs === null || cyjs === undefined) {
    return null
  }



  const isLayoutAvailable = cyjs.isLayout

  let layout = PRESET_LAYOUT
  if (!isLayoutAvailable) {
    layout = COSE_SETTING
  } else if (cyjs.elements.length > 1000) {
    layout = COCENTRIC_LAYOUT
  }

  return (
    <CytoscapeComponent
      elements={cyjs.elements}
      layout={layout}
      style={BASE_STYLE}
      stylesheet={cyjs.style}
      cy={cy => (cyInstance = cy)}
    />
  )
}

export default CytoscapeViewer
