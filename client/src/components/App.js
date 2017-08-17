import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import { Home } from './Home';
import { Users } from './Users';
import { NotFoundPage } from './NotFoundPage';
import '../_/css/App.css';

class App extends Component {
    render() {
        return (
            <Router>
                <div id="app">
                    <header>
                        <li>
                            <Link to={`/`}>Home</Link>
                        </li>
                        <li>
                            <Link to={`/login`}>Login</Link>
                        </li>
                        <li>
                            <Link to={`/users`}>Users</Link>
                        </li>
                    </header>
                    <p className="App-intro">
                        To get started, edit <code>src/App.js</code> and save to reload.
                    </p>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/users" component={Users} />
                        <Route component={NotFoundPage} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
