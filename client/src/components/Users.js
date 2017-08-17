import React from 'react';
import { Link } from 'react-router-dom';

export class Users extends React.Component {

    // this.users = Object.keys(this.state.users).map((content, idx) => {
    //     // const items = this.state.person.loc[content].map((item, i) => (
    //     //     <p key={i}>{item.text}</p>
    //     // ))
    //     console.info("Content: ", content, idx);
    //
    //     return (
    //         <h2> User </h2>
    //     );
    // })

    constructor(props) {
      super(props);
      var self = this;
      self.state = { users: [] };
      fetch('/users')
          .then(res => res.json())
          .then(function (res) {
              console.log(res);
              if (res.data) {
                  self.state = { users: res.data };
              }
          });
    }

    componentWillMount() {
        console.log(this.props);
    }

    componentDidMount() {
        var self = this;
        fetch('/users')
            .then(res => res.json())
            .then(function (res) {
                console.log(res);
                if (res.data) {
                    self.state = { users: res.data };
                }
            });

    }

    render() {
        return (
            <div className="page-users">
                <h1>HOME</h1>
                <p>
                    <Link to="/">Go back to the main page</Link>
                </p>
                <ul>
                    {this.state.users.length}
                </ul>
            </div>
        );
    }
}

export default Users;
