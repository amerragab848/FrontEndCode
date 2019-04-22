import React, { Component } from "react";
import "./Styles/css/font-awesome.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./Styles/css/rodal.css";
import "./Styles/scss/en-us/layout.css";
import "./Styles/scss/en-us/reactCss.css";
import Menu from "./Pages/Menu/Menu";
import Login from './Componants/Layouts/Login'
import Route from './router';
import api from './api';
//import Shield from './Shield';
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
      <div>
        <Menu />
        {Route}
      </div>
      : <Login />
    return (
      <Provider store={store}>
        <Shield>
          <div>
            {showComp}
            <ToastContainer autoClose={3000} />
          </div>
        </Shield>
      </Provider>

    );
  }
}
class Shield extends React.Component {
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
  }

  render() {
    if(this.state.error) {
      // Some error was thrown. Let's display something helpful to the user
      return (
        <div>
          <h5>Sorry. something went wrong .A team of highly trained developers has been dispatched to deal with this situation!</h5>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.info.componentStack}
          </details>
        </div>
      );
    }
    // No errors were thrown. As you were.
    return this.props.children;
  }
}
export default App;
