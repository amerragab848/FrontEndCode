import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./Styles/css/font-awesome.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./Styles/css/rodal.css";
import "./Styles/css/semantic.min.css";

import Menu from "./Pages/Menu/Menu";
import Login from "./Componants/Layouts/Login";
import Route from "./router";
import { Provider } from "react-redux";

import configureStore from "./store/configureStore";
import { ToastContainer } from "react-toastify";
import Config from "./Services/Config";

const loadingStyle = {
  container: {
    position: "fixed",
    top: "0",
    right: "0",
    left: "0",
    bottom: "0",
    display: "-webkit-flex",
    display: "flex",
    WebkitAlignItems: "center",
    alignItems: "center",
    WebkitJustifyContent: "center",
    justifyContent: "center",
    WebkitFlexFlow: "column",
    flexFlow: "column",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: "999",
    minHeight: "250px"
  },
  spinner: {
    width: "64px",
    height: "64px",
    border: "solid 6px #4382f9",
    borderBottomColor: "transparent",
    borderRadius: "50%",
    WebkitAnimation: "rotate 1s linear infinite",
    animation: "rotate 1s linear infinite"
  }
}

const store = configureStore();

const IsAuthorize = Config.IsAuthorized();
class App extends Component {

  state = {
    cssLoaded: false,
    isComplete: false
  }

  componentDidMount() {

    let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

    fetch("/assets/IP_Configrations.json").then(r => r.json()).then(data => {
      Config.SetConfigObject(data);
    }).then(e => {
      currentLanguage === "ar" ? import("./Styles/scss/ar-eg/layout-ar.css").then(css => {
        this.setState({
          cssLoaded: true,
          isComplete: true
        })
      }) : import("./Styles/scss/en-us/layout.css").then(css => {
        this.setState({
          cssLoaded: true,
          isComplete: true
        })
      });
    });

  }

  render() {
    const showComp = IsAuthorize ? (
      <div id="direction_warrper">
        {this.state.isComplete === true ? <Menu /> : null}
        {Route}
      </div>
    ) : (
        this.state.isComplete === true ? <Login /> : null
      );

    return this.state.cssLoaded ? (
      <Provider store={store}>
        <ErrorHandler>
          <div>
            {showComp}
            <ToastContainer autoClose={3000} />
          </div>
        </ErrorHandler>
      </Provider>
    ) : (
        <div style={loadingStyle.container}><span style={loadingStyle.spinner}></span></div>
      );
  }
}

class ErrorHandler extends React.Component {
  constructor(props) {
    super(props);
    // Add some default error states
    this.state = {
      error: false,
      info: null
    };
  }

  componentDidCatch(error, info) {
    // Something happened to one of my children.
    // Add error to state
    this.setState({
      error: error,
      info: info
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
                A team of highly trained developers has been
                dispatched to deal with this situation!
                            </p>
            </div>
            <NavLink to="/">
              <span className="goBack">
                <i
                  className="fa fa-angle-double-left"
                  aria-hidden="true"
                />
                Back to Dashboard
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
