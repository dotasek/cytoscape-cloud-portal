import { handleActions } from 'redux-actions'
import { CxToJs, CyNetworkUtils } from 'cytoscape-cx2js'
import * as vs from '../assets/data/styles.json'

import {
  ndexNetworkFetchStarted,
  networkFetchStarted,
  networkFetchFailed,
  networkFetchSucceeded,
  selectNode,
  selectEdge,
  deselectAll,
  setNetworkSize
} from '../actions/network'

const defaultState = {
  isFetching: false,
  uuid: '',
  jobId: '',
  sourceId: '',
  networkName: '',
  queryGenes: [],
  originalCX: null,
  nodeCount: 0,
  edgeCount: 0,
  niceCX: null,
  network: null,
  style: null,
  layoutScalingFactor: null,
  backgroundColor: null,
  isLayoutComplete: false,
  selectedNode: null,
  selectedEdge: null
}

const utils = new CyNetworkUtils()
const cx2js = new CxToJs(utils)

const PRESET_VS = vs.default[0].style

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

const network = handleActions(
  {
    [ndexNetworkFetchStarted]: (state, payload) => {
      console.log('ndexNetworkFetchStarted', payload.payload)
      return {
        ...state,
        isFetching: true,
        nodeCount: 0,
        edgeCount: 0,
        jobId: null,
        sourceId: null,
        uuid: payload.payload.networkUUID,
        networkName: payload.payload.networkName,
        queryGenes: [],
        originalCX: null,
        niceCX: null,
        network: null,
        style: null,
        layoutScalingFactor: null,
        backgroundColor: null,
        isLayoutComplete: false
      }
    },
    [networkFetchStarted]: (state, payload) => {
      console.log('Query start: genes = ', payload)
      return {
        ...state,
        isFetching: true,
        nodeCount: 0,
        edgeCount: 0,
        jobId: payload.payload.id,
        sourceId: payload.payload.sourceUUID,
        uuid: payload.payload.networkUUID,
        networkName: payload.payload.networkName,
        queryGenes: payload.payload.geneList,
        originalCX: null,
        niceCX: null,
        network: null,
        style: PRESET_VS,
        layoutScalingFactor: 2.0,
        backgroundColor: '#222233',
        isLayoutComplete: false
      }
    },
    [networkFetchSucceeded]: (state, payload) => {
      const cytoscapeJSData = convertCx2cyjs(state, payload.cx)

      const isLayoutAvailable = cytoscapeJSData.isLayout

      let layout = PRESET_LAYOUT
      if (!isLayoutAvailable && cytoscapeJSData.elements.length < 500) {
        layout = COSE_SETTING
      } else if (!isLayoutAvailable) {
        layout = COCENTRIC_LAYOUT
      }

      return {
        ...state,
        originalCX: payload.cx,
        niceCX: cytoscapeJSData.niceCX,
        network: cytoscapeJSData.elements,
        style: cytoscapeJSData.style,
        layout: layout,
        backgroundColor: state.backgroundColor
          ? state.backgroundColor
          : payload.backgroundColor,
        isFetching: false
      }
    },
    [networkFetchFailed]: (state, payload) => {
      return {
        ...state,
        network: null,
        originalCX: null,
        niceCX: null,
        network: null,
        style: null,
        layoutScalingFactor: null,
        backgroundColor: null,
        isFetching: false,
        nodeCount: 0,
        edgeCount: 0
      }
    },
    [setNetworkSize]: (state, payload) => {
      return {
        ...state,
        nodeCount: payload.payload.nodeCount,
        edgeCount: payload.payload.edgeCount
      }
    },
    [selectNode]: (state, payload) => {
      return { ...state, selectedNode: payload.payload, selectedEdge: null }
    },
    [selectEdge]: (state, payload) => {
      return { ...state, selectedNode: null, selectedEdge: payload.payload }
    },
    [deselectAll]: (state, payload) => {
      return { ...state, selectedNode: null, selectedEdge: null }
    }
  },
  defaultState
)

const convertCx2cyjs = (network, originalCX) => {
  const attributeNameMap = {}
  const niceCX = utils.rawCXtoNiceCX(originalCX)
  const elementsObj = cx2js.cyElementsFromNiceCX(niceCX, attributeNameMap)

  const updatedStyle = network.style
    ? styleUpdater(network.style, network.queryGenes)
    : cx2js.cyStyleFromNiceCX(niceCX, attributeNameMap)
  const updatedNodes = network.layoutScalingFactor
    ? adjustLayout(
        elementsObj.nodes,
        network.queryGenes,
        network.layoutScalingFactor
      )
    : elementsObj.nodes
  const elements = [...updatedNodes, ...elementsObj.edges]

  return {
    niceCX,
    elements,
    style: updatedStyle,
    isLayout: checkLayout(elementsObj.nodes)
  }
}

// Utility function to get better results
const adjustLayout = (nodes, queryGenes, layoutScalingFactor) => {
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
        x: position.x * layoutScalingFactor,
        y: position.y * layoutScalingFactor
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

export default network
