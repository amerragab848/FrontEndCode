import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./Styles/css/font-awesome.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./Styles/css/rodal.css";
import "./Styles/css/semantic.min.css";

// import "./Styles/scss/en-us/layout.css";
// import "./Styles/scss/en-us/reactCss.css";

//  import "./Styles/scss/ar-eg/layout-ar.css";
//  import "./Styles/scss/ar-eg/ReactCss-ar.css";

import Styles from "./CurrentLang";

import Menu from "./Pages/Menu/Menu";
import Login from './Componants/Layouts/Login'
import Route from './router';
import api from './api';
import {
  Provider
} from 'react-redux';

import configureStore from './store/configureStore';
import { ToastContainer } from "react-toastify";




const store = configureStore();

const IsAuthorize = api.IsAuthorized()
class App extends Component {

  render() {
    const showComp = IsAuthorize ?
      <div id="direction_warrper" >
        <Menu />
        {Route}
      </div>
      : <Login />
    return (
      <Provider store={store}>
        <ErrorHandler >
          <div>
            {showComp}
            <ToastContainer autoClose={3000} />
          </div>
        </ErrorHandler >
      </Provider>

    );
  }
}

class ErrorHandler extends React.Component {
  constructor(props) {
    super(props);
    // Add some default error states
    this.state = {
      error: false,
      info: null,
    };
  }

  componentDidCatch(error, info) {
    // Something happened to one of my children.
    // Add error to state
    this.setState({
      error: error,
      info: info,
    });
    //  logErrorToMyService(error, info);
  }

  render() {
    if (this.state.error) {
      // Some error was thrown. Let's display something helpful to the user
      return (
        <div className="screen-error active">
          <div className="screen-error-text">
            <div>
              <p>
                <span>Sorry</span> Something went Wrong
              </p>
              <p>
                A team of highly trained developers has been dispatched to deal with this situation!
              </p>
            </div>
            <NavLink to="/" >
              <span className="goBack">
                <i className="fa fa-angle-double-left" aria-hidden="true"></i>Back to Dashboard
            </span>
            </NavLink>
          </div>
        </div>
      );
    }
    // No errors were thrown. As you were.
    return this.props.children;
  }
}

export default App;
