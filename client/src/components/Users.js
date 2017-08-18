import React from 'react';
import { Link } from 'react-router-dom';


const UserLink = props => {
    const user = props.user;
    return (<li><Link to={`/user/${user.id}`}>{user.name}</Link> - {user.email}</li>);
};

export class Users extends React.Component {

    constructor(props) {
        super(props);
        const self      = this;
        const perPage   = 10;
        const page      = parseInt(props.match.params.page, 0) || 1;
        const start     = (page - 1) * perPage;
        this.state      = {users: []};

        fetch(`/users?start=${start}&count=${perPage}`)
            .then(res => res.json())
            .then(function (res) {
                if (res.data) {
                    self.setState({users: res.data})
                }
            });

    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="page-users">
                <h1>USERS</h1>
                <p>
                    <Link to="/">Go back to the main page</Link>
                </p>
                <ul>
                {
                    this.state.users.length && this.state.users.map(
                        user => <UserLink key={user.id} user={user} />
                    )
                }
                </ul>
            </div>
        );
    }
}

export default Users;
