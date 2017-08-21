import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import { Home } from './Home';
import { Users } from './Users';
import { User } from './User';
import { NotFoundPage } from './NotFoundPage';

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
                    <section id="body">
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route path="/users/:page" component={Users} />
                            <Route exact path="/users" component={Users} />
                            <Route path="/user/:userId" component={User} />
                            <Route component={NotFoundPage} />
                        </Switch>
                    </section>
                </div>
            </Router>
        );
    }
}

export default App;
