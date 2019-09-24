import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Profile from "./Profile";
import PrivacySetting from "./PrivacySetting";
import Timesheet from './Timesheet';
import Expenses from './Expenses';
import DocumentEmailNotification from './DocumentEmailNotification';
import Resources from "../../resources.json";
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import * as actions from '../../store/actions/Adminstration';
import { bindActionCreators } from 'redux';
let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
class Index extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0
    };
  }

  render() {
    return (
      <div className="mainContainer main__fulldash">
        <div className="customeTabs">
          <Tabs selectedIndex={this.props.Adminstration.userTabIndex} onSelect={tabIndex => this.props.actions.userSettingsTabIndex(tabIndex)}>
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
        </div>
      </div>
    );
  }
}

//export default ;
const mapStateToProps = (state) => {

  let sState = state;
  return sState;
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Index));
