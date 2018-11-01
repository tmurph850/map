import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './app.min.css';
import Container from './components/Container';
import Nav from './containers/Nav';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Nav />
        <Container />
      </div>
    );
  }
}


export default App;
