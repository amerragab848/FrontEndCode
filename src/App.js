import React, { Component } from "react";
import routes from "./router";
import SendToInbox from "./Componants/OptionsPanels/SendToInbox";
import "./Styles/scss/en-us/layout.css"; 
import CreateTransmittal from "./Componants/OptionsPanels/CreateTransmittal";
import SendTask from "./Componants/OptionsPanels/SendTask";
import Letter from "./Pages/Communication/Letter";
import DistributionList from "./Componants/OptionsPanels/DistributionList";
import Filter from "./Componants/FilterComponent/filterComponent";
import TimeSheet from "./Componants/DashBoardDetails/timeSheetDetails"; 
// import SendToInbox from  './Componants/OptionsPanels/SendToInbox';
import SendWorkFlow from  './Componants/OptionsPanels/SendWorkFlow';
 
// import CreateTransmittal from  './Componants/OptionsPanels/CreateTransmittal';
// import SendTask from  './Componants/OptionsPanels/SendTask';

// import DistributionList from  './Componants/OptionsPanels/DistributionList';
import DashBoard from  './Pages/DashBoard'; 
import ViewAttachment from './Componants/OptionsPanels/ViewAttachmments'
import Validation from './Componants/OptionsPanels/validationRules'
// import SendToWorkflow from './Componants/OptionsPanels/SendWorkFlow'

import Upload from './Componants/OptionsPanels/UploadAttachment'

class App extends Component {
  render() {
    return (
      ///test
      //<SendToInbox />
      // <DashBoard/>
      //  <Letter/>
      //<SendTask/>
      // <DistributionList />
      <TimeSheet />
    );
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
  }
}
//  <DashBoard/>
//<CreateTransmittal/>
// <SendTask/>
// <DistributionList />
//import DistributionList from  './Componants/OptionsPanels/DistributionList';
//import DashBoard from  './Pages/DashBoard';

// class App extends Component {
//   render() {

//     return (
//     	///test
//       //<SendToInbox />
//     // <DashBoard/>
//    <CreateTransmittal/>
//     //<SendTask/>
//      //<DistributionList />
//     );
//   }
// }

export default App;
