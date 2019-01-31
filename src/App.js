import React, { Component } from 'react';
import "./Styles/scss/en-us/layout.css"; 
//import SendToInbox from  './Componants/OptionsPanels/SendToInbox';
//sayed
import CreateTransmittal from  './Componants/OptionsPanels/CreateTransmittal';
import SendTask from  './Componants/OptionsPanels/SendTask';
import ViewWorkFlow from  './Componants/OptionsPanels/ViewWorkFlow';
 
import Letter from  './Pages/Communication/Letter';  
import DashBoard from  './Pages/DashBoard';  

class App extends Component {
  render() {
  	 
    return (
    	///test
      //<SendToInbox />  
    // <DashBoard/>
   //<Letter/>
  //<SendTask/> 
  <ViewWorkFlow/>
    );
  }
}

export default App;
