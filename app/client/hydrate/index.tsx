// import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import renderApp from '../render'

// @ts-ignore
const initState = window.INITIAL_STATE
console.log(initState)
hydrateRoot(document.getElementById('app') as HTMLElement, renderApp(initState.workData, initState.type))
