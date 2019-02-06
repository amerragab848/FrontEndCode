import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import UploadSigniture from './uploadSigniture'
import Profile from './Profile'
export default () => (
  <Tabs>
    <TabList>
      <Tab>user Signiture</Tab>
      <Tab>Title 2</Tab>
    </TabList>
    <div className="mainContainer">
    <TabPanel>
     
     <UploadSigniture />
    
    </TabPanel>
    <TabPanel>
     <Profile />
    </TabPanel>
    </div>
  </Tabs>
);