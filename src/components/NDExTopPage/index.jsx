import React from 'react'
import AppShell from '../AppShell'
import StartPanel from './StartPanel'

const NDExTopPage = props => (
  <AppShell {...props}>
    <StartPanel {...props} />
  </AppShell>
)

export default NDExTopPage
