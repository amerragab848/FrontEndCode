import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
//import Semantic from './Styles/js/semantic.min'
// import './Styles/scss/en-us/layout.css'

// const history = createBrowserHistory();

// window.nav_history = history;

// const app = (
//   <Router history={history}>
//     <App />
//   </Router>
// );

//ReactDOM.render(app, document.getElementById("root"));
ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
