import React, { useEffect, useState } from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import Cytoscape from 'cytoscape'
import CyCanvas from 'cytoscape-canvas'
import { CxToCyCanvas } from 'cyannotation-cx2js'
import { CxToJs, CyNetworkUtils } from 'cytoscape-cx2js'

import './style.css'
import Warning from './Warning'
import * as vs from '../../../assets/data/styles.json'

Cytoscape.use(CyCanvas)

let cyInstance = null

const LAYOUT_SCALING_FACTOR = 2.0

const BASE_STYLE = {
  width: '100%',
  height: '100%',
  background: 'rgba(0,0,0,0)'
}

const PRESET_VS = vs.default[0].style

const SELECTION_COLOR = '#F2355B'

// Standard selection
PRESET_VS.push({
  selector: 'node:selected',
  css: {
    'background-color': 'red',
    color: '#FFFFFF',
    'background-opacity': 1,
    'border-width': 0,
    width: 100,
    height: 100
  }
})

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

  const convertCx2cyjs = (niceCX, queryGenes) => {
    const attributeNameMap = {}
    const elementsObj = cx2js.cyElementsFromNiceCX(niceCX, attributeNameMap)

    // This contains original style.
    const style = cx2js.cyStyleFromNiceCX(niceCX, attributeNameMap)
    //props.network.useOriginalStyle ? { width: '100%', height: '100%', background: 'rgba(0,0,0,0)' } : BASE_STYLE

    const updatedStyle = props.network.useOriginalStyle ? style : styleUpdater(PRESET_VS, queryGenes)
    const updatedNodes = props.network.useOriginalStyle ? elementsObj.nodes : adjustLayout(elementsObj.nodes, queryGenes)
    const elements = [...updatedNodes, ...elementsObj.edges]

    return {
      elements,
      style: updatedStyle,
      isLayout: props.network.useOriginalStyle || checkLayout(elementsObj.nodes)
    }
  }

  // Utility function to get better results
  const adjustLayout = (nodes, queryGenes) => {
    let len = nodes.length

    const upperQuery = new Set(queryGenes.map(gene => gene.toUpperCase()))

    while (len--) {
      const node = nodes[len]
      const position = node.position

      const name = node.data.name ? node.data.name.toUpperCase() : null
      if (upperQuery.has(name)) {
        node.data['query'] = 'true'
      }

      if (position !== undefined) {
        node.position = {
          x: position.x * LAYOUT_SCALING_FACTOR,
          y: position.y * LAYOUT_SCALING_FACTOR
        }
      }
    }
    return nodes
  }

  const checkLayout = nodes => {
    // Just checks first node only!
    const node = nodes[0]
    if (node.position === undefined) {
      return false
    } else {
      return true
    }
  }

  const styleUpdater = style => {
    PRESET_VS.push({
      selector: 'node:selected',
      css: {
        'background-color': SELECTION_COLOR,
        width: ele => ele.width() * 1.3,
        height: ele => ele.height() * 1.3
      }
    })

    PRESET_VS.push({
      selector: 'edge:selected',
      css: {
        'line-color': SELECTION_COLOR,
        'target-arrow-color': SELECTION_COLOR,
        opacity: 1.0,
        width: 6
      }
    })

    PRESET_VS.push({
      selector: '.connected',
      css: {
        'background-color': SELECTION_COLOR,
        'background-opacity': 1.0
      }
    })
    return style
  }

  const numObjects = props.network.nodeCount + props.network.edgeCount
  if (numObjects > 5000) {
    return <Warning />
  }

  if (props.network.originalCX === null || props.network.originalCX === undefined) {
    return null
  }
  const utils = new CyNetworkUtils()
  const cx2js = new CxToJs(utils)
  const niceCX = utils.rawCXtoNiceCX(props.network.originalCX)
  const cyjs = convertCx2cyjs(niceCX, props.network.queryGenes) //props.network.network
  const annotations = new CxToCyCanvas(cx2js)
  const selectedGenes = props.search.selectedGenes

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

  console.log("Style", cyjs.style)

  const cxBGColor = props.network.useOriginalStyle ? cx2js.cyBackgroundColorFromNiceCX(props.network.originalCX) : '#222233'
  //cx2js.cyBackgroundColorFromNiceCX(niceCX)

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
        annotations.drawAnnotationsFromNiceCX(cyInstance, niceCX)
      }}
    />
  )
}

export default CytoscapeViewer
