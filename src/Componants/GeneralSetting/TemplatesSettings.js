import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import Accounts from './Accounts/Accounts'
import Companies from './Companies/Index';
import ExpensesWorkFlowLog from './Project/ExpensesWorkFlow/ExpensesWorkFlowLog'
import GeneralList from '../GeneralSetting/MenuDefaultData/GeneralList'
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import config from "../../Services/Config";
import Resources from "../../resources.json";
import { connect } from 'react-redux'
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class TemplatesSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: this.props.Adminstration.tabIndex,
            showNotify:false
        };
    }
    NoPermission=()=>{
        this.setState({
            showNotify:true
        })
        setTimeout(() => {
            this.setState({
                showNotify:false
            })
        }, 1000);
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
                                    <h4 className="zero">{Resources['Project'][currentLanguage]}</h4>
                                </li>
                                {(config.IsAllow(1179)) ?
                                <Tab>
                                    <span className="subUlTitle">{Resources['expensesWorkFlow'][currentLanguage]}</span>
                                </Tab> :null}


                                <li className="title">
                                    <h4 className="zero">{Resources['menuDefaultData'][currentLanguage]}</h4>
                                </li>
                                {(config.IsAllow(1179)) ?
                                <Tab>
                                    <span className="subUlTitle">{Resources['AccountsDefaultList'][currentLanguage]}</span>
                                </Tab> :null}


                            </TabList>
                        </div>
            
                        <div className="setting-tabs-contant">

                     {(config.IsAllow(794)) ? 
                            <TabPanel>
                                <Accounts />
                            </TabPanel>
                          :null} 
                            
                            {(config.IsAllow(1001105)) ? 
                            <TabPanel>
                                <Companies />
                            </TabPanel>
                             :null} 

                
                           {(config.IsAllow(1001105)) ?
                            <TabPanel>
                                <ExpensesWorkFlowLog />
                            </TabPanel>
                            :null}


                            {(config.IsAllow(1179)) ?
                            <TabPanel>
                                <GeneralList />
                            </TabPanel>
                             : null  }
                        </div>
                    </Tabs> 

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    let sState = state;
    return sState;
}
export default withRouter(connect(mapStateToProps)(TemplatesSettings));
