import React from 'react'
import AppShell from '../AppShell'
import StartPanel from './StartPanel'

import { Typography } from '@material-ui/core'

const NDExTopPage = props => (
  <AppShell {...props}>
    <StartPanel {...props} />
  </AppShell>
)

export default NDExTopPage
