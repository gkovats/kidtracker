import React from 'react';
import { Link } from 'react-router-dom';

var user = {};

export class User extends React.Component {

    constructor(props) {
        super(props);
        const self      = this;
        const userId    = parseInt(props.match.params.userId, 0) || 0;
        this.state      = {user: {}};

        fetch(`/user/${userId}`)
            .then(res => res.json())
            .then(function (res) {
                if (res.data) {
                    user = res.data;
                    self.setState({user: res.data})
                }
            });

    }

    componentDidMount() {

    }

    componentDidUpdate() {
        console.info("updated!", this.state);
    }

    render() {
        return (
            <div className="page-users">
                <h1>USER</h1>
                <ul>
                    <li>
                        <label>Name</label>
                        {user.name}
                    </li>
                    <li>
                        <label>Email</label>
                        {user.email}
                    </li>
                    <li>
                        <label>Registered</label>
                        {user.createdAt}
                    </li>
                </ul>
                <p>
                    <Link to="/users">Back to users list</Link>
                </p>
            </div>
        );
    }
}

export default User;
