import React, { Component } from 'react';
 
import "./Styles/scss/en-us/layout.css"; 
import SendToInbox from  './Componants/OptionsPanels/SendToInbox';
import DistributionList from  './Componants/OptionsPanels/DistributionList';
import DashBoard from  './Pages/DashBoard'; 

class App extends Component {
  render() {
  	 
    return (
    	///test
      <DistributionList /> 
    );
  }
}

export default App;
