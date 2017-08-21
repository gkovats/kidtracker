import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import './sass/app.scss';

// ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
  React.createElement(App, {}, null),
  document.getElementById('root')
);

registerServiceWorker();
