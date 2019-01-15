import React, { Component } from 'react';
import "./Styles/scss/en-us/layout.css"; 
import SendToInbox from  './Componants/OptionsPanels/SendToInbox';
//sayed
import CreateTransmittal from  './Componants/OptionsPanels/CreateTransmittal';
import DashBoard from  './Pages/DashBoard'; 

class App extends Component {
  render() {
  	 
    return (
    	///test
     // <SendToInbox /> 
    // <DashBoard/>
    <CreateTransmittal/>
    );
  }
}

export default App;
