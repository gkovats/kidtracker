import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import './sass/app.scss';

// @TODO: Figure out why Bootstrap JS still complains about no jQuery via webpack
// import 'jquery';
// import 'popper.js';

// @TODO: ENh? https://react-bootstrap.github.io/

// ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
  React.createElement(App, {}, null),
  document.getElementById('root')
);

registerServiceWorker();
