import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import Accounts from './Accounts/Accounts'
import Companies from './Companies/Index';
import PermissionsGroups from './Administrations/GroupsPermission/permissionsGroups';
import CurrencyExchangeRates from './Administrations/currencyExchangeRates';
import ExpensesWorkFlowLog from './Project/ExpensesWorkFlow/ExpensesWorkFlowLog'
import GeneralConfiguration from './Project/GeneralConfiguration'
import GeneralList from '../GeneralSetting/MenuDefaultData/GeneralList'
import SpecSectionChild from '../GeneralSetting/MenuDefaultData/specSectionChild'
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import config from "../../Services/Config";
import Resources from "../../resources.json";
import { connect } from 'react-redux'
import * as actions from '../../store/actions/Adminstration'
import EpsPermission from "../../Pages/Eps/EpsPermission"
import { bindActionCreators } from 'redux';


let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class TemplatesSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //tabIndex: this.props.Adminstration.tabIndex,
            showNotify: false
        };
    }

    NoPermission = () => {
        this.setState({
            showNotify: true
        })
        setTimeout(() => {
            this.setState({
                showNotify: false
            })
        }, 1000);
    }

    componentDidMount = () => {

    }
    render() {
        return (
            <div className='mainContainer main__fulldash'>

                <Tabs className="settings-container" selectedIndex={this.props.Adminstration.tabIndex} onSelect={tabIndex => this.props.actions.routeToTabIndex(tabIndex)}>
                    <div className="settings-tabs-items">
                        <h3 className="zero">Settings</h3>
                        <TabList>
                            <li className="title">
                                <h4 className="zero">{Resources['userMenu'][currentLanguage]}</h4>
                            </li>
                            {(config.IsAllow(794)) ?
                                <Tab>
                                    <span className="subUlTitle">{Resources['titleAccounts'][currentLanguage]}</span>
                                </Tab> : null}
                            {(config.IsAllow(802)) ?
                                <Tab>
                                    <span className="subUlTitle">{Resources['groupsPermissions'][currentLanguage]}</span>
                                </Tab> : null}
                            {(config.IsAllow(1255)) ?
                                <Tab>
                                    <span className="subUlTitle">{Resources['Companies'][currentLanguage]}</span>
                                </Tab> : null}

                            {(config.IsAllow(3744)) ?
                                <Tab>
                                    <span className="subUlTitle">{Resources['currencyExchangeRates'][currentLanguage]}</span>
                                </Tab> : null}
                            <li className="title">
                                <h4 className="zero">{Resources['Project'][currentLanguage]}</h4>
                            </li>
                            {(config.IsAllow(1260)) ?
                                <Tab>
                                    <span className="subUlTitle">{Resources['EPS'][currentLanguage]}</span>
                                </Tab> : null}
                            {(config.IsAllow(1179)) ?
                                <Tab>
                                    <span className="subUlTitle">{Resources['expensesWorkFlow'][currentLanguage]}</span>
                                </Tab> : null}

                            {(config.IsAllow(388)) ?
                                <Tab>
                                    <span className="subUlTitle">{Resources['GeneralConfig'][currentLanguage]}</span>
                                </Tab> : null}


                            <li className="title">
                                <h4 className="zero">{Resources['menuDefaultData'][currentLanguage]}</h4>
                            </li>
                            {(config.IsAllow(1179)) ?
                                <Tab>
                                    <span className="subUlTitle">{Resources['AccountsDefaultList'][currentLanguage]}</span>
                                </Tab> : null}
                            {(config.IsAllow(3342)) ?
                                <Tab>
                                    <span className="subUlTitle">{Resources['subSpecsSection'][currentLanguage]}</span>
                                </Tab> : null}

                        </TabList>
                    </div>

                    <div className="setting-tabs-contant">

                        {(config.IsAllow(794)) ?
                            <TabPanel>
                                <Accounts />
                            </TabPanel>
                            : null}

                        {(config.IsAllow(802)) ?
                            <TabPanel>
                                <PermissionsGroups />
                            </TabPanel>
                            : null}
                        {(config.IsAllow(1255)) ?
                            <TabPanel>
                                <Companies />
                            </TabPanel>
                            : null}
                        {(config.IsAllow(3744)) ?
                            <TabPanel>
                                <CurrencyExchangeRates />
                            </TabPanel>
                            : null}
                        {(config.IsAllow(1260)) ?
                            <TabPanel>
                                <EpsPermission />
                            </TabPanel>
                            : null}
                        {(config.IsAllow(1001105)) ?
                            <TabPanel>
                                <ExpensesWorkFlowLog />
                            </TabPanel>
                            : null}
                        {(config.IsAllow(388)) ?
                            <TabPanel>
                                <GeneralConfiguration />
                            </TabPanel>
                            : null}


                        {(config.IsAllow(1179)) ?
                            <TabPanel>
                                <GeneralList />
                            </TabPanel>
                            : null}

                        {(config.IsAllow(3342)) ?
                            <TabPanel>
                                <SpecSectionChild />
                            </TabPanel>
                            : null}
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

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TemplatesSettings));
