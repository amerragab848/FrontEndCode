import React, { Component } from "react";
//import routes from "./router"; 
import "./Styles/scss/en-us/layout.css"; 
import CreateTransmittal from "./Componants/OptionsPanels/CreateTransmittal";
import SendTask from "./Componants/OptionsPanels/SendTask";
import Letter from "./Pages/Communication/Letter";
import DistributionList from "./Componants/OptionsPanels/DistributionList";
import Filter from "./Componants/FilterComponent/filterComponent";
import TimeSheet from "./Componants/DashBoardDetails/timeSheetDetails";  
import SendWorkFlow from  './Componants/OptionsPanels/SendWorkFlow';
  
import DashBoard from  './Pages/DashBoard'; 
import ViewAttachment from './Componants/OptionsPanels/ViewAttachmments'
import Validation from './Componants/OptionsPanels/validationRules' 

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
      // <TimeSheet />
       <Letter />
     // <div>
       //    {routes}
      //</div>
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
    // return ( 
    //   <TimeSheet />
    // );  
  }
}  

export default App;
