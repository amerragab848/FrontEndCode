import React, { Component } from 'react';
import "./Styles/scss/en-us/layout.css"; 
import SendToInbox from  './Componants/OptionsPanels/SendToInbox';
import SendWorkFlow from  './Componants/OptionsPanels/SendWorkFlow';
//sayed
import CreateTransmittal from  './Componants/OptionsPanels/CreateTransmittal';
import SendTask from  './Componants/OptionsPanels/SendTask';
 
import Letter from  './Pages/Communication/Letter';  
import DashBoard from  './Pages/DashBoard';  

class App extends Component {
  render() {
  	 
    return (
    	///test
      <SendWorkFlow />  
    // <DashBoard/>
   //<Letter/>
  //<SendTask/> 
    );
  }
}

export default App;
