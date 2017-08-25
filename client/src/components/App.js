import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import { NavBar } from './lib/NavBar';
import { Login } from './Login';
import { Home } from './Home';
import { Users } from './Users';
import { User } from './User';
import { NotFoundPage } from './NotFoundPage';

// @GK: Use react bootstrap library? https://react-bootstrap.github.io/

class App extends Component {
  render() {
    return (
      <Router>
        <div id="app">
          <section id="body" className="container-fluid">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/users/:page" component={Users} />
              <Route exact path="/users" component={Users} />
              <Route path="/user/:userId" component={User} />
              <Route path="/login" component={Login} />
              <Route component={NotFoundPage} />
            </Switch>
          </section>
        </div>
      </Router>
    );
  }
}

export default App;
