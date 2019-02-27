import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import Accounts from '../GeneralSetting/Accounts/Accounts'
import Companies from '../GeneralSetting/Companies/Index';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";


class Settings extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            tabIndex: 0,
        };
    }
    render() {
        return (
            <div className='mainContainer'>    
                    <Tabs className="settings-container" selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
                        <div className="settings-tabs-items">
                            <h3 className="zero">Settings</h3>
                            <TabList>
                            <li className="title">
                                    <h4 className="zero">Administration</h4>
                                </li>
                                <Tab>
                                    <span className="subUlTitle">Accounts</span>
                                </Tab>
                                <Tab>
                                    <span className="subUlTitle">Companies</span>
                                </Tab>

                                <Tab>
                                    <span className="subUlTitle">Accounts</span>
                                </Tab>
                                <li className="title">
                                    <h4 className="zero">Project</h4>
                                </li>
                                <Tab>
                                    <span className="subUlTitle">Accounts</span>
                                </Tab>

                                <Tab>
                                    <span className="subUlTitle">Accounts</span>
                                </Tab>
                                <li className="title">
                                    <h4 className="zero">Menu Default Data</h4>
                                </li>
                            </TabList>
                        </div>
            
                        <div className="setting-tabs-contant">

                            <TabPanel>
                                <Accounts />
                            </TabPanel>

                            <TabPanel>
                                <Companies />
                            </TabPanel>

                        </div>
                    </Tabs> 

            </div>

        )
    }
}
export default withRouter(Settings)


