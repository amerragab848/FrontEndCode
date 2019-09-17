import React, { Component } from "react";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import Router from "../../URLRoutes";
import Resources from "../../resources.json";
import Config from "../../Services/Config";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as dashboardComponantActions from "../../store/actions/communication";

let currentLanguage =
    localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class LeftReportMenu extends Component {
    constructor(props) {
        super(props);

        let inventory = [];
        let OtherReports = [];
        let technicalOffice = [];
        let contractPoMenu = [];
        let ProjectReports = [];
        let RiskReports = [];

        //initialize of link
        Router.map(route => {
            if (route.settings) {
                if (route.settings.OtherReports === true) {
                    if (Config.IsAllow(route.settings.permission)) {
                        OtherReports.push({
                            label: Resources[route.title][currentLanguage],
                            value: route.moduleId
                        });
                    }
                } else if (route.settings.technicalOffice === true) {
                    if (Config.IsAllow(route.settings.permission)) {
                        technicalOffice.push({
                            label: Resources[route.title][currentLanguage],
                            value: route.moduleId
                        });
                    }
                } else if (route.settings.ContractsPo === true) {
                    if (Config.IsAllow(route.settings.permission)) {
                        contractPoMenu.push({
                            label: Resources[route.title][currentLanguage],
                            value: route.moduleId
                        });
                    }
                } else if (route.settings.inventory === true) {
                    if (Config.IsAllow(route.settings.permission)) {
                        inventory.push({
                            label: Resources[route.title][currentLanguage],
                            value: route.moduleId
                        });
                    }
                } else if (route.settings.ProjectReports === true) {
                    if (Config.IsAllow(route.settings.permission)) {
                        ProjectReports.push({
                            label: Resources[route.title][currentLanguage],
                            value: route.moduleId
                        });
                    }
                } else if (route.settings.RiskReport === true) {
                    if (Config.IsAllow(route.settings.permission)) {
                        RiskReports.push({
                            label: Resources[route.title][currentLanguage],
                            value: route.moduleId
                        });
                    }
                }
            }
        });

        this.moduleNameData = [
            Resources.projectReports[currentLanguage],
            Resources.contractsPurchaseOrders[currentLanguage],
            Resources.tasksReports[currentLanguage],
            Resources.timeSheetReport[currentLanguage],
            Resources.otherReports[currentLanguage],
            Resources.inventoryRpt[currentLanguage],
            Resources.technicalOffice[currentLanguage],
            Resources.reportsRisk[currentLanguage]
        ];

        this.reportData = [
            { data: ProjectReports },
            { data: contractPoMenu },
            { data: [] },
            { data: [] },
            { data: OtherReports },
            { data: inventory },
            { data: technicalOffice },
            { data: RiskReports }
        ];

        this.state = {
            1: true,
            menuLength: 7,
            selectedReport: {
                label: Resources.selectReport[currentLanguage],
                value: "0"
            },
            subReports: ProjectReports,
            moduleName: Resources.projectReports[currentLanguage]
        };
    }

    activeLi = index => {
        for (var i = 1; i <= this.state.menuLength; i++) {
            if (i == index) this.setState({ [i]: true });
            if (i != index) this.setState({ [i]: false });
        }
        let subReports = this.reportData[index - 1].data;
        let moduleName = this.moduleNameData[index - 1];
        this.setState({ subReports, moduleName });
        this.setState({
            selectedReport: {
                label: Resources.selectReport[currentLanguage],
                value: "0"
            }
        });
    };

    getReport = event => {
        this.setState({ selectedReport: event });
        if (event.value) {
            import(`../../Pages/ReportsCenter/${event.value}`).then(module =>
                this.setState({ module: module.default })
            );
        }
    };

    componentWillMount() {
        this.props.actions.ReportCenterMenuClick();
    }

    render() {
        let Component = this.state.module;
        return (
            <div className="mainContainer main__fulldash">
                <div className="settings-container reportsContainer">
                    <React.Fragment>
                        <div className="settings-tabs-items">
                            <h3 className="zero">
                                {Resources.Reports[currentLanguage]}
                            </h3>
                            <ul className="zero">
                                <li data-tab="subiTab-1" className={this.state[1] === true ? "active" : " "}
                                    onClick={() => this.activeLi(1)}>
                                    <span className="subUlTitle">
                                        {Resources.projectReports[currentLanguage]}
                                    </span>
                                </li>
                                <li data-tab="subiTab-2" className={this.state[2] === true ? "active" : " "} onClick={() => this.activeLi(2)}>
                                    <span className="subUlTitle">
                                        {Resources.contractsPurchaseOrders[currentLanguage]}
                                    </span>
                                </li>
                                <li data-tab="subiTab-3" className={this.state[3] === true ? "active" : " "}
                                    onClick={() => this.activeLi(3)}>
                                    <span className="subUlTitle">
                                        {Resources.tasksReports[currentLanguage]}
                                    </span>
                                </li>
                                <li data-tab="subiTab-4" className={this.state[4] === true ? "active" : " "}
                                    onClick={() => this.activeLi(4)}>
                                    <span className="subUlTitle">
                                        {Resources.timeSheetReport[currentLanguage]}
                                    </span>
                                </li>
                                <li data-tab="subiTab-5" className={this.state[5] === true ? "active" : " "} onClick={() => this.activeLi(5)}>
                                    <span className="subUlTitle">
                                        {Resources.otherReports[currentLanguage]}
                                    </span>
                                </li>
                                <li data-tab="subiTab-6" className={this.state[6] === true ? "active" : " "} onClick={() => this.activeLi(6)}>
                                    <span className="subUlTitle">
                                        {Resources.inventoryRpt[currentLanguage]}
                                    </span>
                                </li>
                                <li data-tab="subiTab-7" className={this.state[7] === true ? "active" : " "} onClick={() => this.activeLi(7)}>
                                    <span className="subUlTitle">
                                        {Resources.technicalOffice[currentLanguage]}
                                    </span>
                                </li>
                                <li data-tab="subiTab-7" className={this.state[8] === true ? "active" : " "} onClick={() => this.activeLi(8)}>
                                    <span className="subUlTitle">
                                        {Resources.reportsRisk[currentLanguage]}
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="setting-tabs-contant">
                            <div className="reports__menu">
                                <label className="control-label">
                                    {this.state.moduleName}
                                </label>
                                <div className="reposrts__menu--dropdown">
                                    <Dropdown data={this.state.subReports} selectedValue={this.state.selectedReport}
                                        handleChange={event => this.getReport(event)} name="drop" id="drop" />
                                </div>
                            </div>
                            <ErrorHandler>
                                {this.state.selectedReport.value == "0" ? null :
                                    (<div className="reports__content" id="ren">
                                        {Component != null ? (
                                            <Component />
                                        ) : null}
                                    </div>
                                    )}
                            </ErrorHandler>
                        </div>
                    </React.Fragment>
                </div>
            </div>
        );
    }
}

class ErrorHandler extends React.Component {
    constructor(props) {
        super(props);
        // Add some default error states
        this.state = {
            error: false,
            info: null
        };
    }

    componentDidCatch(error, info) {
        // Something happened to one of my children.
        // Add error to state
        this.setState({
            error: error,
            info: info
        });
        //  logErrorToMyService(error, info);
    }

    render() {
        if (this.state.error) {
            // Some error was thrown. Let's display something helpful to the user
            return (
                <div>
                    <h5>
                        Sorry. something went wrong .A team of highly trained
                        developers has been dispatched to deal with this
                        situation!
                    </h5>
                    <details style={{ whiteSpace: "pre-wrap" }}>
                        {this.state.info.componentStack}
                    </details>
                </div>
            );
        }
        // No errors were thrown. As you were.
        return this.props.children;
    }
}

function mapStateToProps(state, ownProps) {
    return {
        showLeftMenu: state.communication.showLeftMenu,
        showLeftReportMenu: state.communication.showLeftReportMenu
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(dashboardComponantActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftReportMenu);
