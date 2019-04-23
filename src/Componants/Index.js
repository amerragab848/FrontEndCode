import React, { Component, Fragment } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import CryptoJS from 'crypto-js'; 

import "react-tabs/style/react-tabs.css";

import {  Widgets, WidgetsWithText } from "./CounterWidget";
import { ChartWidgetsData, BarChartComp, PieChartComp } from "./ChartsWidgets";
import { ThreeWidgetsData, ApprovedWidget } from "./ThreeWidgets";
import DashBoardWidgets from "./WidgetsDashBorad";
import DashBoard from "./DashBoard";
import _ from "lodash";
import language from "../resources.json";
import Api from "../api";

let currentLanguage =  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0,
      dashBoardIndex: 0,
      value: 0,
      counterData: [],
      counterDataDetails: [],
      chartData: ChartWidgetsData,
      threeWidgets: ThreeWidgetsData,
      viewDashBoard: false,
      viewSub: false,
      viewMenu: 0,
      isLoading: false,
      widgets: []
    };
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

  componentWillMount() { }

  renderCounter() {
    let component = this.state.counterData.map(widget =>
      Api.IsAllow(widget.permission) === true ? (
        <Widgets
          key={widget.id}
          title={widget.title}
          api={widget.api}
          value={widget.value}
          apiDetails={widget.apiDetails}
          isModal={widget.isModal}
          route={widget.route}
        />
      ) : null
    );
    return component;
  }

  renderCounterDetails() {
    let component = this.state.counterDataDetails.map(widgetDetails =>
      Api.IsAllow(widgetDetails.permission) === true ? (
        <WidgetsWithText
          key={widgetDetails.id}
          title={widgetDetails.title}
          value={widgetDetails.value}
          total={widgetDetails.total}
          api={widgetDetails.api}
          apiDetails={widgetDetails.apiDetails}
          isModal={widgetDetails.isModal}
          route={widgetDetails.route}
        />
      ) : null
    );

    return component;
  }

  renderCharts() {
    let chartWidgets = this.state.chartData.map((item, index) => {
      if (item.type === "pie") {
        return (
          <div className="col-xs-4" key={item.id}>
            <PieChartComp
              api={item.props.api}
              name={item.props.name}
              y={item.props.y}
              title={language[item.title][currentLanguage]}
              seriesName={language[item.seriesName][currentLanguage]}
            />
          </div>
        );
      } else {
        return (
          <div className="col-xs-8" key={item.id}>
            <BarChartComp
              api={item.props.api}
              name={item.props.name}
              y={item.props.data}
              title={language[item.title][currentLanguage]}
              stack={item.stack}
              yTitle={language[item.yTitle][currentLanguage]}
              catagName={item.catagName}
              multiSeries={item.multiSeries}
              barContent={item.barContent}
            />
          </div>
        );
      }
    });

    return chartWidgets;
  }

  renderThreeCard(index) {

    let renderWidgets = "";

    try { 
      let Widgets_Order = CryptoJS.enc.Base64.parse(this.getFromLS("Widgets_Order")).toString(CryptoJS.enc.Utf8)
 
      Widgets_Order = Widgets_Order != "" ? JSON.parse(Widgets_Order) : {};
 
      let selectedCategoriesLocalStoarge = Object.keys(Widgets_Order);

      if (selectedCategoriesLocalStoarge.length > 0) {

        //console.log('Widgets_Order...selectedWidgetinLocalStoarge...');

        let bulkWidgets = "";

        bulkWidgets = Widgets_Order[index];

        bulkWidgets = _.orderBy(bulkWidgets, ['order'], ['asc']);

        if (bulkWidgets.length > 0) {
          renderWidgets = (
            <div className="SummeriesContainer ">
              {bulkWidgets.map((widget, index) => {
                return (<Fragment key={index}> {widget.checked === true ? (
                  <Fragment>
                    {widget.key == "0-1" ? null :
                      <h2 className="SummeriesTitle">
                        {language[widget.widgetCategory][currentLanguage]}
                      </h2>
                    }
                    <div className={"SummeriesContainerContent " + (widget.key == "0-1" ? " numbersContainerContent" : " ")}>
                      {widget.widgets.length > 0 ? widget.widgets.map(panel => {
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
          <div className="SummeriesContainer ">
            {refrence.map((widget, index) => {
              return (
                <Fragment key={index}>
                  {widget.key == "0-1" ? null :
                    <h2 className="SummeriesTitle">
                      {language[widget.widgetCategory][currentLanguage]}
                    </h2>
                  }
                  <div className={"SummeriesContainerContent " + (widget.key == "0-1" ? " numbersContainerContent" : " ")}>
                    {widget.widgets.length > 0
                      ? widget.widgets.map(panel => {
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
 
      localStorage.removeItem("Widgets_Order");

      var refrence = DashBoardWidgets.filter(function (i) {
        return i.refrence === index;
      });

      renderWidgets = (
        <div className="SummeriesContainer ">
          {refrence.map((widget, index) => {
            return (
              <Fragment key={index}>
                <h2 className="SummeriesTitle">
                  {language[widget.widgetCategory][currentLanguage]}
                </h2>
                <div className={"SummeriesContainerContent " + (widget.key == "0-1" ? " numbersContainerContent" : " ")}>
                  {widget.widgets.length > 0
                    ? widget.widgets.map(panel => {
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
        <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.onClickTabItem(tabIndex)}>
          <TabList>
            <Tab>
              <span className="subUlTitle">
                {language["general"][currentLanguage]}
              </span>
            </Tab>
            <Tab>
              <span className="subUlTitle">
                {language["counters"][currentLanguage]}
              </span>
            </Tab>
            <Tab>
              <span className="subUlTitle">
                {language["projectsLogs"][currentLanguage]}
              </span>
            </Tab>
          </TabList>
          <div className="dashboard__name">
            <h3 className="welcome-title">
              {language["titleDashboard"][currentLanguage]} , Hady
            </h3>
            <button className="primaryBtn-2 btn mediumBtn" onClick={this.viewDashBoardHandler.bind(this)}>
              Customize
            </button>
          </div>
          <TabPanel>{this.state.tabIndex === 0 ? this.renderThreeCard(0) : null}</TabPanel>
          <TabPanel> {this.state.tabIndex === 1 ? this.renderThreeCard(1) : null}</TabPanel>
          <TabPanel className="App"><div className="row charts__row">{this.state.tabIndex === 2 ? this.renderCharts() : null}</div></TabPanel>
        </Tabs>
        {this.state.viewDashBoard ? (<DashBoard opened={this.state.viewDashBoard} closed={this.closeModal.bind(this)} />) : null}
      </div>
    );
  }
}

export default Index;
