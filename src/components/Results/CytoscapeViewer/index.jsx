import React, { useEffect, useState } from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import Cytoscape from 'cytoscape'
import CyCanvas from 'cytoscape-canvas'
import { CxToCyCanvas } from 'cyannotation-cx2js'
import { CxToJs } from 'cytoscape-cx2js'
import './style.css'
import Warning from './Warning'

Cytoscape.use(CyCanvas)

let cyInstance = null

const BASE_STYLE = {
  width: '100%',
  height: '100%',
  background: 'rgba(0,0,0,0)'
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

  console.log('** Network rendering start:', props)

  const numObjects = props.network.nodeCount + props.network.edgeCount
  if (numObjects > 5000) {
    return <Warning />
  }

  if (
    props.network.originalCX === null ||
    props.network.originalCX === undefined
  ) {
    return null
  }

  const { resized } = props

  console.log('%%%%%%%%%%resize:', resized)

  if (cyInstance !== null) {
    cyInstance.resize()
  }

  return (
    <CytoscapeComponent
      elements={props.network.network}
      layout={props.network.layout}
      style={BASE_STYLE}
      stylesheet={props.network.style}
      cy={cy => {
        cyInstance = cy
        console.log("network background color:" + props.network.backgroundColor)
        if (props.network.backgroundColor) {
          const backgroundLayer = cyInstance.cyCanvas({
            zIndex: -2
          })

          const canvas = backgroundLayer.getCanvas()
          const ctx = backgroundLayer.getCanvas().getContext('2d')

          cyInstance.on('render cyCanvas.resize', function() {
            console.log('resize CyCanvas', props.network.backgroundColor)
            ctx.fillStyle = props.network.backgroundColor
            ctx.fillRect(0, 0, canvas.width, canvas.height)
          })
        }

        if (props.network.niceCX) {
          const annotations = new CxToCyCanvas(CxToJs)
          annotations.drawAnnotationsFromNiceCX(cyInstance, props.network.niceCX)
        }
      }}
    />
  )
}

export default CytoscapeViewer
