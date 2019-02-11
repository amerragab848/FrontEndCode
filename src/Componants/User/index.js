import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Profile from "./Profile";
import PrivacySetting from "./PrivacySetting";
import Timesheet from './Timesheet';
import Expenses from './Expenses';
import DocumentEmailNotification from './DocumentEmailNotification';
import Resources from "../../resources.json";

let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
class Index extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      tabIndex: 0,
    };
  }

  render() {
    return (
      <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
         <TabList>
          <Tab> {Resources["profile"][currentLanguage]}</Tab>
          <Tab> {Resources["expenses"][currentLanguage]}</Tab>
          <Tab> {Resources["peetyCash"][currentLanguage]}</Tab>
          <Tab> {Resources["timeSheet"][currentLanguage]}</Tab>
          <Tab> {Resources["docEmailNotificationSettings"][currentLanguage]}</Tab>
        </TabList>
        <TabPanel>
          <Profile />
        </TabPanel>
        <TabPanel>
          <Expenses />
        </TabPanel>
        <TabPanel>
          <Profile />
        </TabPanel>
        <TabPanel>
          <Timesheet />
        </TabPanel>
        <TabPanel>
          <DocumentEmailNotification />
        </TabPanel>
      </Tabs>
    );
  }
}

export default Index;
