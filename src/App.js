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
          <div>
            {showComp}   
            <ToastContainer autoClose={3000} />
          </div>  
      </Provider>
 
    );
  }
}

export default App;
