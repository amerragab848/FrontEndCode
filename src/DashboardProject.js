import React, { Component, Fragment } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import CryptoJS from 'crypto-js';

import "react-tabs/style/react-tabs.css";

import { Widgets, WidgetsWithText } from "./Componants/CounterWidget";
//import { ChartWidgetsData, BarChartComp, PieChartComp } from "./Componants/ChartsWidgets";

import { ThreeWidgetsData, ApprovedWidget } from "./Componants/ThreeWidgets";

import DashBoardWidgets from "./Componants/WidgetsDashBoradProject";
import DashBoard from "./Componants/DashBoardProject";
import _ from "lodash";
import language from "./resources.json";

import { connect } from 'react-redux';
import {
  bindActionCreators
} from 'redux';

import * as dashboardComponantActions from './store/actions/communication';

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class DashboardProject extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0,
      dashBoardIndex: 0,
      value: 0,
      counterData: [],
      counterDataDetails: [],
      threeWidgets: ThreeWidgetsData,
      viewDashBoard: false,
      viewSub: false,
      viewMenu: 0,
      isLoading: false,
      widgets: [],
      projectId: this.props.projectId == 0 ? localStorage.getItem('lastSelectedProject') : this.props.projectId
    };
  }

  componentWillMount = () => {

    let projectId = this.props.projectId == 0 ? localStorage.getItem('lastSelectedProject') : this.props.projectId;

    var e = { label: this.props.projectName, value: projectId };
    this.props.actions.RouteToDashboardProject(e);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.projectId && this.state.projectId) {
      this.setState({
        projectId: nextProps.projectId
      });
      this.renderThreeCard(0);
    }
  };

  renderThreeCard(index) {
    let renderWidgets = "";

    try {
      let Widgets_Order = CryptoJS.enc.Base64.parse(this.getFromLS("Widgets_Project_Order")).toString(CryptoJS.enc.Utf8)

      Widgets_Order = Widgets_Order != "" ? JSON.parse(Widgets_Order) : {};

      let selectedCategoriesLocalStoarge = Object.keys(Widgets_Order);

      if (selectedCategoriesLocalStoarge.length > 0) {

        let bulkWidgets = "";

        bulkWidgets = Widgets_Order[index];

        bulkWidgets = _.orderBy(bulkWidgets, ['order'], ['asc']);

        if (bulkWidgets.length > 0) {
          renderWidgets = (
            <div className="SummeriesContainer mainContainer">
              {bulkWidgets.map((widget, index) => {
                return (<Fragment key={index}> {widget.checked === true ? (
                  <Fragment>
                    <h2 className="SummeriesTitle">
                      {language[widget.widgetCategory][currentLanguage]}
                    </h2>
                    <div className={"SummeriesContainerContent "}>
                      {widget.widgets.length > 0 ? widget.widgets.map(panel => {

                        let api = panel.props.api + this.state.projectId
                        panel.props.api = api

                        if (panel.checked === true) {
                          if (panel.type === "threeWidget") {
                            return (<ApprovedWidget key={panel.key} {...panel} title={language[panel.title][currentLanguage]} />);
                          } else if (panel.type === "twoWidget") {
                            return (<WidgetsWithText key={panel.key} title={panel.title} {...panel} />);
                          } else {
                            return (<Widgets key={panel.key} title={panel.title} {...panel} />);
                          }
                        }
                      })
                        : null}
                    </div>
                  </Fragment>
                ) : null}
                </Fragment>
                );
              })}
            </div>
          );
        }
      } else {
        var refrence = DashBoardWidgets.filter(function (i) {
          return i.refrence === index;
        });

        renderWidgets = (
          <div className="SummeriesContainer mainContainer">
            {refrence.map((widget, index) => {
              return (
                <Fragment key={index}>
                  <h2 className="SummeriesTitle">
                    {language[widget.widgetCategory][currentLanguage]}
                  </h2>
                  <div className={"SummeriesContainerContent "}>
                    {widget.widgets.length > 0 ?
                      widget.widgets.map(panel => {

                        let api = panel.props.api + this.state.projectId
                        panel.props.api = api

                        if (panel.type === "threeWidget") {
                          return (<ApprovedWidget key={panel.key} {...panel} title={language[panel.title][currentLanguage]} />);
                        }
                        else if (panel.type === "twoWidget") {
                          return (<WidgetsWithText key={panel.key} title={panel.title} {...panel} />);
                        }
                        else {
                          return (<Widgets key={panel.key} title={panel.title} {...panel} />);
                        }
                      }) : null}
                  </div>
                </Fragment>
              );
            })}
          </div>
        );
      }
    }
    catch (err) {
      localStorage.removeItem("Widgets_Project_Order");
      var refrence = DashBoardWidgets.filter(function (i) {
        return i.refrence === index;
      });

      renderWidgets = (
        <div className="SummeriesContainer mainContainer">
          {refrence.map((widget, index) => {
            return (
              <Fragment key={index}>
                <h2 className="SummeriesTitle">
                  {language[widget.widgetCategory][currentLanguage]}
                </h2>
                <div className={"SummeriesContainerContent "}>
                  {widget.widgets.length > 0 ?
                    widget.widgets.map(panel => {

                      let api = panel.props.api + this.state.projectId
                      panel.props.api = api

                      if (panel.type === "threeWidget") {
                        return (<ApprovedWidget key={panel.key} {...panel} title={language[panel.title][currentLanguage]} />);
                      }
                      else if (panel.type === "twoWidget") {
                        return (<WidgetsWithText key={panel.key} title={panel.title} {...panel} />);
                      }
                      else {
                        return (<Widgets key={panel.key} title={panel.title} {...panel} />);
                      }
                    }) : null}
                </div>
              </Fragment>
            );
          })}
        </div>
      );

    }
    return renderWidgets;
  }

  getFromLS(key) {
    let ls = {};
    if (global.localStorage) {
      try {
        ls = JSON.parse(global.localStorage.getItem(key)) || "";
      } catch (e) { }
    }
    return ls;
  }

  viewDashBoardHandler() {
    this.setState({
      viewDashBoard: !this.state.viewDashBoard
    });
  }

  closeModal() {
    this.setState({
      viewDashBoard: false
    });
  }

  onClickTabItem(tabIndex) {
    this.renderThreeCard(tabIndex);

    this.setState({
      tabIndex: tabIndex
    });
  }

  render() {

    return (
      <div className="customeTabs">
        <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.onClickTabItem(0)}>
          <TabList>
            <Tab>
              <span className="subUlTitle">
                {language["counters"][currentLanguage]}
              </span>
            </Tab>
          </TabList>
          <div className="dashboard__name">
            <button className="primaryBtn-2 btn mediumBtn" onClick={this.viewDashBoardHandler.bind(this)}>Customize</button>
          </div>
          <TabPanel>{this.renderThreeCard(0)}</TabPanel>
        </Tabs>
        {this.state.viewDashBoard ? (<DashBoard opened={this.state.viewDashBoard} closed={this.closeModal.bind(this)} />) : null}
      </div>
    );
  }

}

function mapStateToProps(state, ownProps) {
  return {
    showLeftMenu: state.communication.showLeftMenu,
    showSelectProject: state.communication.showSelectProject,
    projectId: state.communication.projectId,
    projectName: state.communication.projectName
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(dashboardComponantActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardProject);
