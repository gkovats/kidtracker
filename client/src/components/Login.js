import React from 'react';
import { Link } from 'react-router-dom';

export class Login extends React.Component {

  componentWillMount() {

  }

  render() {
    return (
      <div className="not-found">
      <div className="login-panel panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Please Sign In</h3>
        </div>
        <div className="panel-body">
          <form>
            <fieldset>
              <div className="form-group">
                <input className="form-control" placeholder="Email" name="email" type="email" autoFocus="" />
              </div>
              <div className="form-group">
                <input className="form-control" placeholder="Password" name="password" type="password" value="" />
              </div>
              <div className="checkbox">
                <label>
                  <input name="remember" type="checkbox" value="Remember Me"/>Remember Me
                </label>
              </div>
              <a href="index.html" className="btn btn-lg btn-success btn-block">Login</a>
            </fieldset>
          </form>
        </div>
      </div>

        <p>
          <Link to="/">Go back to the main page</Link>
        </p>
      </div>
    );
  }
}

export default Login;
