import React, { Component, Fragment } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import CryptoJS from 'crypto-js';
import LoadingSection from "../Componants/publicComponants/LoadingSection";
import "react-tabs/style/react-tabs.css";
import { WidgetData, Widgets, WidgetsWithText } from "./CounterWidget";
import { ChartWidgetsData, BarChartComp, PieChartComp } from "./ChartsWidgets";
import { ThreeWidgetsData, ApprovedWidget } from "./ThreeWidgets";
import DashBoardWidgets from "./WidgetsDashBorad";
import DashBoard from "./DashBoard";
import _ from "lodash";
import language from "../resources.json";
import Api from "../api"; 
import { withRouter } from "react-router-dom";

let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class phoneAddEdit extends Component {
  constructor(props) {
    super(props);
alert("")
    this.state = {
  
    };
  }



  render() {
    return (
      <div className="customeTabs">
hello
      </div>
    );
  }
}

export default withRouter(phoneAddEdit);
