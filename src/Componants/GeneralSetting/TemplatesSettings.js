import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import Accounts from './Accounts/Accounts'
import Companies from './Companies/Index';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Resources from "../../resources.json";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class TemplatesSettings extends Component {
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
                                        <h4 className="zero">{Resources['userMenu'][currentLanguage]}</h4>
                                </li>

                                <Tab>
                                    <span className="subUlTitle">{Resources['titleAccounts'][currentLanguage]}</span>
                                </Tab>

                                <Tab>
                                    <span className="subUlTitle">{Resources['Companies'][currentLanguage]}</span>
                                </Tab>

                       
                                <li className="title">
                                    <h4 className="zero">Project</h4>
                                </li>

                                <Tab>
                                    <span className="subUlTitle">Project1</span>
                                </Tab>

                                <Tab>
                                    <span className="subUlTitle">Project2</span>
                                </Tab>

                                <li className="title">
                                    <h4 className="zero">Menu Default Data</h4>
                                </li>
                                <Tab>
                                    <span className="subUlTitle">Menu Default Data1</span>
                                </Tab> 
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
export default withRouter(TemplatesSettings)


