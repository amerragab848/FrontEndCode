import React, { Component } from "react";
import routes from "./router";
import "./Styles/scss/en-us/layout.css";
import "./Styles/scss/en-us/reactCss.css";

import CreateTransmittal from "./Componants/OptionsPanels/CreateTransmittal";
import SendTask from "./Componants/OptionsPanels/SendTask";
import Letter from "./Pages/Communication/Letter";
import DistributionList from "./Componants/OptionsPanels/DistributionList";
import Filter from "./Componants/FilterComponent/filterComponent";
import TimeSheet from "./Componants/DashBoardDetails/TimeSheetDetails";
import SendWorkFlow from "./Componants/OptionsPanels/SendWorkFlow";
import PrivacySetting from './Componants/User/PrivacySetting '


import ViewWorkFlow from "./Componants/OptionsPanels/ViewWorkFlow";
import DashBoard from "./Pages/DashBoard";
import Menu from "./Pages/Menu/Menu";
import ViewAttachment from "./Componants/OptionsPanels/ViewAttachmments"; 

import Upload from "./Componants/OptionsPanels/UploadAttachment";
import CopyTo from "./Componants/OptionsPanels/CopyTo";
import SendByEmails from "./Componants/OptionsPanels/SendByEmails";
import WfApproval from './Componants/OptionsPanels/wfApproval';



class App extends Component {
  render() {
    return (
      //<WfApproval/>
     <PrivacySetting />
      ///test
      //<SendToInbox />
      // <DashBoard/>
      //  <Letter/>
      //<SendTask/>
      //<DistributionList />
      // <TimeSheet />
      // <div>
      //      {routes}
      // </div>
      // <CopyTo />
      // <SendByEmails />
   // <ViewWorkFlow />
    //);
    ///test
    // <SendToInbox />
    // <DashBoard/>
    //<CreateTransmittal/>
    // <SendTask/>
    //  <DistributionList />
    //<ViewAttachment />
    //<Validation />

    // return (
    //   <SendWorkFlow />
    // )
    // return (
    //   <TimeSheet />
    // ); 
    );
  }
}

export default App;
