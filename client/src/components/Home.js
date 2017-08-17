import React from 'react';
import { Link } from 'react-router-dom';

export class Home extends React.Component {
    componentWillMount() {
        console.log(this.props);
    }

    render() {
        return (
            <div className="not-found">
                <h1>HOME</h1>
                <p>
                    <Link to="/">Go back to the main page</Link>
                </p>
            </div>
        );
    }
}

export default Home;
