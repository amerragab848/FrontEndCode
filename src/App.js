import React, { Component } from 'react';
 
import "./Styles/scss/en-us/layout.css"; 
import SendToInbox from  './Componants/OptionsPanels/SendToInbox';

import DashBoard from  './Pages/DashBoard'; 

class App extends Component {
  render() {
  	 
    return (
    	///test
     // <SendToInbox /> 
     <DashBoard/>
    );
  }
}

export default App;
