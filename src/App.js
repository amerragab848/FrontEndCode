import React, { Component } from 'react';
import "./Styles/scss/en-us/layout.css"; 
import SendToInbox from  './Componants/OptionsPanels/SendToInbox';
import DashBoard from  './Pages/DashBoard'; 
//sayed
import CreateTransmittal from  './Componants/OptionsPanels/CreateTransmittal';
import SendTask from  './Componants/OptionsPanels/SendTask';


class App extends Component {
  render() {
  	 
    return (
    	///test
    // <SendToInbox /> 
    // <DashBoard/>
   <CreateTransmittal/>
   // <SendTask/>
    );
  }
}

export default App;
