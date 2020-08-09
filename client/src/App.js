import React from 'react';
import logo from './logo.svg';
import './App.css';
import UserList from './components/UserList'
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Link to="/login">Login</Link> |&nbsp;
        <Link to="/main">Main</Link> |&nbsp;
        <Link to="/about">About</Link> |&nbsp;
      </div>
      <Switch>
        <Route path="/login">
          <a href="/auth">Login</a>
        </Route>
        <Route path="/main">
          Main <br/>
          <UserList/>
        </Route>
        <Route path="/about">
          About
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
