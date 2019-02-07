import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Profile from './Profile'
export default () => (
  <Tabs>
    <TabList>
      <Tab>Profile</Tab>
   
    </TabList>
    <div className="mainContainer">
    
    <TabPanel>
     <Profile />
    </TabPanel>
   
    </div>
  </Tabs>
);