import React, { Component } from 'react';
import "./Styles/scss/en-us/layout.css"; 
//import SendToInbox from  './Componants/OptionsPanels/SendToInbox';
//sayed
import CreateTransmittal from  './Componants/OptionsPanels/CreateTransmittal';
import SendTask from  './Componants/OptionsPanels/SendTask';

//import DistributionList from  './Componants/OptionsPanels/DistributionList';
//import DashBoard from  './Pages/DashBoard'; 

class App extends Component {
  render() {
  	 
    return (
    	///test
      //<SendToInbox /> 
    // <DashBoard/>
   <CreateTransmittal/>
    //<SendTask/>
     //<DistributionList /> 
    );
  }
}

export default App;
