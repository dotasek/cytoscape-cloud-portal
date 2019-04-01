import React, { useEffect, useState } from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import Cytoscape from 'cytoscape'
import CyCanvas from 'cytoscape-canvas'
//import { CxToCyCanvas } from 'cyannotation-cx2js'

import './style.css'
import Warning from './Warning'

Cytoscape.use(CyCanvas)

let cyInstance = null

const BASE_STYLE = { width: '100%', height: '100%', background: 'rgba(0,0,0,0)' }

const PRESET_LAYOUT = {
  name: 'preset',
  padding: 6
}

const COCENTRIC_LAYOUT = {
  name: 'concentric',
  padding: 6,
  minNodeSpacing: 100
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
        cyInstance.nodes().removeClass('connected')
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
        cyInstance.nodes().removeClass('connected')
        const selected = this.data()
        props.networkActions.selectNode(selected)
      } catch (e) {
        console.warn(e)
      }
    })

    cyInstance.on('tap', 'edge', function() {
      try {
        cyInstance.nodes().removeClass('connected')
        const selected = this.data()
        const { source, target } = selected

        cyInstance.$('#' + source + ', #' + target).addClass('connected')

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
  if (!isLayoutAvailable && cyjs.elements.length < 500) {
    layout = COSE_SETTING
  } else if (!isLayoutAvailable) {
    layout = COCENTRIC_LAYOUT
  }

  const { resized } = props

  console.log('%%%%%%%%%%resize:', resized)

  if (cyInstance !== null) {
    cyInstance.resize()
  }

  var cxBGColor = '#222233'
  //cx2js.cyBackgroundColorFromNiceCX(niceCX)
  //cyjs.annotations.drawAnnotationsFromNiceCX(cyInstance, niceCX)

  return (
    <CytoscapeComponent
      elements={cyjs.elements}
      layout={layout}
      style={BASE_STYLE}
      stylesheet={cyjs.style}
      cy={cy => {
        cyInstance = cy
        console.log(cyInstance)
        if (cxBGColor) {
          var backgroundLayer = cyInstance.cyCanvas({
            zIndex: -2
          })

          var canvas = backgroundLayer.getCanvas()
          var ctx = backgroundLayer.getCanvas().getContext('2d')

          cyInstance.on('render cyCanvas.resize', function() {
            console.log('resize CyCanvas', cxBGColor)
            ctx.fillStyle = cxBGColor
            ctx.fillRect(0, 0, canvas.width, canvas.height)
          })
        }
      }}
    />
  )
}

export default CytoscapeViewer
