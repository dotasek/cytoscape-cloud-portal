import React, { useEffect } from "react";
import './style.css'
import InputPanel from '../InputPanel'
import Results from '../Results'

import AppShell from '../AppShell'

const HomePanel = props => {

  useEffect(() => {



    props.sourceActions.findSourceStarted()
    if (props.uiState.urlParams.has('suid')) {
      props.uiStateActions.setNDExImportOpen(true)
      console.log("Importing network.")
    }
    return () => {
      console.log('Result home Page unmounted')
    }
  }, [])

  console.log('----------------------- New Home Panel ------------------')
  return (
    <AppShell {...props}>
      <div className="container">
        <InputPanel className="input" {...props} />
        <Results className="results" {...props} />
      </div>
    </AppShell>
  )
}

export default HomePanel
