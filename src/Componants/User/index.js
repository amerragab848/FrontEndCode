import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Profile from './Profile'
export default () => (
  <Tabs>
    <TabList>
      <Tab>Profile</Tab>
      <Tab>Expenses</Tab>
      <Tab>Petty Cash</Tab>
      <Tab>Time Sheet</Tab>
      <Tab>Document Email Notification Setting</Tab>
    </TabList>
    <div className="mainContainer">
    
    <TabPanel>
     <Profile />
    </TabPanel>
    </div>
  </Tabs>
);