import React, {Component} from 'react';
import logo from '../img/text_logo.png';

class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false
    };
  }

  render() {
    if ( this.state.loggedIn !== false ) {
      return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <a className="navbar-brand" href="/"><img src={logo} className="the-logo"/></a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item active">
                <a className="nav-link" href="/">login</a>
              </li>
              <li className="nav-item active">
                <a className="nav-link" href="/signup">signup</a>
              </li>
            </ul>
          </div>
        </nav>
        );
    } else {
      return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="/"><img src={logo} className="the-logo"/></a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link active" href="/application-form">applications</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/asset-form">assets</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/new-form">create</a>
              </li>
            </ul>
          </div>
        </nav>
      );
    }
    
  }
}

export default Nav;
