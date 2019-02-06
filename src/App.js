import React, { Component } from "react";

import PrivacySetting from './Componants/User/PrivacySetting '
import DashBoard from "./Pages/DashBoard";
import Menu from "./Pages/Menu/Menu"; 
import Letter from "./Pages/Communication/Letter"; 
import Login from './Componants/Layouts/Login'
import Route from './router';
import api from './api';

import "./Styles/scss/en-us/layout.css";
import "./Styles/scss/en-us/reactCss.css";

// import CreateTransmittal from "./Componants/OptionsPanels/CreateTransmittal";
// import SendTask from "./Componants/OptionsPanels/SendTask";
// import DistributionList from "./Componants/OptionsPanels/DistributionList";
// import Filter from "./Componants/FilterComponent/filterComponent";
// import TimeSheet from "./Componants/DashBoardDetails/TimeSheetDetails";
// import SendWorkFlow from './Componants/OptionsPanels/SendWorkFlow';

// import ViewAttachment from './Componants/OptionsPanels/ViewAttachmments'
// import UploadAttachment from './Componants/OptionsPanels/UploadAttachment'
// import Upload from './Componants/OptionsPanels/UploadAttachment'
// import WFApproval from './Componants/OptionsPanels/wfApproval'
// import SendToInbox from './Componants/OptionsPanels/SendToInbox'
// import CopyTo from "./Componants/OptionsPanels/CopyTo";
// import SendByEmails from "./Componants/OptionsPanels/SendByEmails";
// import WfApproval from './Componants/OptionsPanels/wfApproval';
// import PopUp from './Componants/OptionsPanels/OptionContainer' 
// import ViewWorkFlow from "./Componants/OptionsPanels/ViewWorkFlow";

// let IsAuthorize= !localStorage.getItem('userToken') ? this.props.history.push({pathname: "/"}): null;
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
      <div>
        {showComp}
      </div>
    );
  }
}

export default App;
