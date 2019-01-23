import React, { Component } from "react";
import routes from "./router"; 
import SendToInbox from "./Componants/OptionsPanels/SendToInbox"; 
import "./Styles/scss/en-us/layout.css";
//import SendToInbox from  './Componants/OptionsPanels/SendToInbox';
//sayed
import CreateTransmittal from "./Componants/OptionsPanels/CreateTransmittal";
import SendTask from "./Componants/OptionsPanels/SendTask";

import DistributionList from "./Componants/OptionsPanels/DistributionList";
import Filter from './Componants/FilterComponent/filterComponent';
import TimeSheet from './Componants/DashBoardDetails/timeSheetDetails';

class App extends Component {
  render() {
    //return <div>{routes}</div>;
    return <TimeSheet/>;
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
