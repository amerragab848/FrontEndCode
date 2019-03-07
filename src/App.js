import React, { Component } from "react";
  
import "./Styles/scss/en-us/layout.css";
import "./Styles/scss/en-us/reactCss.css";

import WFApproval from './Componants/OptionsPanels/wfApproval'
import ApprovalRejectDocument from './Componants/OptionsPanels/ApprovalRejectDocument';
import MonitorTasks from "./Componants/DashBoardDetails/MonitorTasks";
import PrivacySetting from './Componants/User/PrivacySetting'
import ViewWorkFlow from "./Componants/OptionsPanels/ViewWorkFlow";
import DashBoard from "./Pages/DashBoard";
import Menu from "./Pages/Menu/Menu"; 
import CommonLog from "./Pages/Communication/CommonLog"; 
import Login from './Componants/Layouts/Login'
import Route from './router';
import api from './api';
import Index from "./Componants/Index";
import WFExpenses from './Componants/User/WFExpenses'
import Companies from './Componants/GeneralSetting/Companies/Index'
import AddNewCompany from './Componants/GeneralSetting/Companies/AddCompany';

import DocumentEmailNotification from './Componants/User/DocumentEmailNotification';
import MonthlyTasksDetails from './Componants/DashBoardDetails/MonthlyTasksDetails';

// import CreateTransmittal from "./Componants/OptionsPanels/CreateTransmittal";
// import SendTask from "./Componants/OptionsPanels/SendTask";
 //import DistributionList from "./Componants/OptionsPanels/DistributionList";
// import Filter from "./Componants/FilterComponent/filterComponent";
// import TimeSheet from "./Componants/DashBoardDetails/TimeSheetDetails";
// import SendWorkFlow from './Componants/OptionsPanels/SendWorkFlow'; 
// import ViewAttachment from './Componants/OptionsPanels/ViewAttachmments'
// import UploadAttachment from './Componants/OptionsPanels/UploadAttachment'
// import Upload from './Componants/OptionsPanels/UploadAttachment'
// import SendToInbox from './Componants/OptionsPanels/SendToInbox'
// import CopyTo from "./Componants/OptionsPanels/CopyTo";
// import SendByEmails from "./Componants/OptionsPanels/SendByEmails";
// import WfApproval from './Componants/OptionsPanels/wfApproval';
// import PopUp from './Componants/OptionsPanels/OptionContainer' 
// import ViewWorkFlow from "./Componants/OptionsPanels/ViewWorkFlow"; 
//import Expenses from './Componants/User/Expenses' 
//import User from './Componants/User/index' 
//import Timesheet from "./Componants/User/Timesheet";

import {
    Provider
} from 'react-redux';

import configureStore from './store/configureStore';
import initialState from './store/initialState';

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
          </div>  
      </Provider>
 
    );
  }
}

export default App;
