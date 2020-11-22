import React, { useState, useEffect } from 'react';
import { Router, Switch, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import socketConnection from 'socket.io-client'

import Login from './Login'
import Home from './Home'
import PrivateRoute from '../container/PrivateRoute'
import Room from './Room'
import PlayRoom from './PlayRoom'
import config from '../env'

function App() {
  const history = createBrowserHistory()
  const SOCKET = process.env.REACT_APP_SOCKET_URL || config.SOCKET_URL
  const [socket, setSocket] = useState(socketConnection(SOCKET))

  useEffect(() => {
    return () => {
      alert('disconnecting....')
      socket.disconnect()
    }
  }, [])

  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Login} />

        <Route path="/room/:id" render={props => {
          return <Room router={props} socket={socket} />
        }} />

        <Route path="/play" render={props => {
          return <PlayRoom router={props} socket={socket} />
        }} />

        <PrivateRoute>
          <Route exact path="/home" component={Home} />
        </PrivateRoute>

      </Switch>
    </Router>

  );
}

export default App;
