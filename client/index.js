/*Main entry point for our application*/

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import App from './App';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

/*
    Hooks the React app up to the DOM,
    Attaches itself to the div with id
    root.
*/

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>, document.getElementById('root')
);
