import { handleActions } from 'redux-actions'

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
  isLayoutComplete: false,
  selectedNode: null,
  selectedEdge: null,
  useOriginalStyle: false
}

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
        network: null,
        isLayoutComplete: false,
        useOriginalStyle: true
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
        network: null,
        isLayoutComplete: false,
        useOriginalStyle: false
      }
    },
    [networkFetchSucceeded]: (state, payload) => {
      return {
        ...state,
        originalCX: payload.cx,
        //network: convertCx2cyjs(payload.cx, state.queryGenes),
        isFetching: false
      }
    },
    [networkFetchFailed]: (state, payload) => {
      return {
        ...state,
        network: null,
        originalCX: null,
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

export default network
