import React, { Component } from "react"; 
import routes from "./router";
import "./Styles/scss/en-us/layout.css";
import SendToInbox from "./Componants/OptionsPanels/SendToInbox";
//sayed
import CreateTransmittal from "./Componants/OptionsPanels/CreateTransmittal";
import SendTask from "./Componants/OptionsPanels/SendTask";

import DistributionList from "./Componants/OptionsPanels/DistributionList";

class App extends Component {
  render() {
    return (
      <div>{routes}</div>
      //  <DashBoard/>
      //<CreateTransmittal/>
      // <SendTask/>
      // <DistributionList />
    );
  }
}

export default App;
