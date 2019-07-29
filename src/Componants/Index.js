import React, { Component, Fragment } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Widgets, WidgetsWithText } from "./CounterWidget";
import { ChartWidgetsData, BarChartComp, PieChartComp, Britecharts } from "./ChartsWidgets";
import { ThreeWidgetsData, ApprovedWidget } from "./ThreeWidgets";
import DashBoardWidgets from "./WidgetsDashBorad";
import DashBoard from "./DashBoard";
import language from "../resources.json";
import Config from "../Services/Config";
import IndexedDb from '../IndexedDb';
import Details from './widgetsDetails';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import value from 'lodash/value';
import mapValues from 'lodash/mapValues';
import { type } from "os";
import orderBy from 'lodash/orderBy';

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0,
      chartData: ChartWidgetsData,
      threeWidgets: ThreeWidgetsData,
      viewDashBoard: false,
      widgets: [],
      generalCategories: [],
      counterCategories: [],
      chartCategories: []
    };
  }

  componentDidMount() {
    this.getWidgets();
  }

  async getWidgets() {
    const data = orderBy(await IndexedDb.getSelectedWidgets(), 'order', 'asc');

    const categoryOrder = await IndexedDb.getCategoryOrder();

    let widgets = "";

    if (data.length > 0) {

      widgets = map(groupBy(data, widget => widget.categoryId), (widgets, categoryId) => {
        return {
          typeId: Details.categories[categoryId].type,
          categoryId: categoryId,
          title: Details.categories[categoryId].title,
          widgets,
          order: categoryOrder[categoryId].order
        }
      });

      widgets = orderBy(widgets, 'order', 'asc');

    } else {

      const getAllWidgets = await IndexedDb.getAll("widget");

      widgets = map(groupBy(getAllWidgets, widget => widget.categoryId), (widgets, categoryId) => {
        return {
          typeId: Details.categories[categoryId].type,
          categoryId: categoryId,
          title: Details.categories[categoryId].title,
          widgets,
          order: categoryOrder[categoryId].order
        }
      });
    }

    const types = groupBy(mapValues(widgets), widget => widget.typeId);

    this.setState({
      generalCategories: types['1'] || [],
      counterCategories: types['2'] || [],
      chartCategories: types['3'] || []
    });

  };

  renderWidget(widget, index) {
    if (Details.widgets[widget.title].props.type === "threeWidget") {
      return <ApprovedWidget key={index + "DIV"} {...Details.widgets[widget.title]} title={language[widget.title][currentLanguage]} />
    }
    else if (Details.widgets[widget.title].props.type === "twoWidget") {
      return <WidgetsWithText key={index + "DIV"} title={widget.title} {...Details.widgets[widget.title]} />
    }
    else if (Details.widgets[widget.title].props.type === "oneWidget") {
      return <Widgets key={index + "DIV"} title={widget.title} {...Details.widgets[widget.title]} />
    }
    else if (Details.widgets[widget.title].props.type === "pie") {

      return <div className="col-lg-4 col-md-6" key={index + "DIVPie"}>
        <PieChartComp api={Details.widgets[widget.title].props.api} y={Details.widgets[widget.title].props.y}
          name={Details.widgets[widget.title].props.name} title={language[widget.title][currentLanguage]}
          seriesName={language[Details.widgets[widget.title].props.seriesName][currentLanguage]} />
      </div>
    }
    else if (Details.widgets[widget.title].props.type === "line") {

      return <Fragment key={index + "DIVBriteCharts"}>
        <Britecharts api={Details.widgets[widget.title].props.api} topicName={widget.topicNames}
          title={language[widget.title][currentLanguage]} />
      </Fragment>
    }
    else {
      return <Fragment key={index + "DIVBarChart"}>
        <BarChartComp api={Details.widgets[widget.title].props.api} ukey={"wt-Name0" + index} catagName={widget.title}
          name={Details.widgets[widget.title].props.name} y={Details.widgets[widget.title].props.data}
          title={language[widget.title][currentLanguage]} stack={Details.widgets[widget.title].props.stack}
          yTitle={language[Details.widgets[widget.title].props.yTitle][currentLanguage]}
          multiSeries={Details.widgets[widget.title].props.multiSeries}
          barContent={Details.widgets[widget.title].props.barContent ? Details.widgets[widget.title].props.barContent : []} />
      </Fragment>
    }
  }

  renderCategory(category, index) {
    return (
      <div className="SummeriesContainer">
        <Fragment key={index}>
          <h2 className="SummeriesTitle">
            {language[category.title][currentLanguage]}
          </h2>
          <div className={"SummeriesContainerContent " + (category.title == "mainAlerts" ? " numbersContainerContent" : " ")}>
            {category.widgets.map((widget, widgetIndex) => {
              if (widget.permission === 0 || Config.IsAllow(widget.permission)) {
                return this.renderWidget(widget, widgetIndex);
              }
            })}
          </div>
        </Fragment>
      </div>
    );
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

    this.getWidgets();
  }

  onClickTabItem(tabIndex) {
    this.setState({
      tabIndex: tabIndex
    });
  }

  render() {

    let contactName = localStorage.getItem("contactName") !== null ? localStorage.getItem('contactName') : 'Procoor User'
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
                {language["chart"][currentLanguage]}
              </span>
            </Tab>
          </TabList>
          <div className="dashboard__name">
            <h3 className="welcome-title">
              {language["titleDashboard"][currentLanguage]} , {contactName}
            </h3>
            <button className="primaryBtn-2 btn mediumBtn" onClick={this.viewDashBoardHandler.bind(this)}>
              {language["customize"][currentLanguage]}
            </button>
          </div>
          <TabPanel>
            {this.state.generalCategories.map((category, index) => this.renderCategory(category, index))}
          </TabPanel>
          <TabPanel>
            {this.state.counterCategories.map((category, index) => this.renderCategory(category, index))}
          </TabPanel>
          <TabPanel className="App">
            <div className="row charts__row">
              {this.state.chartCategories.map((category, index) => this.renderCategory(category, index))}
            </div>
          </TabPanel>
        </Tabs>
        {this.state.viewDashBoard ? (<DashBoard opened={this.state.viewDashBoard} closed={this.closeModal.bind(this)} />) : null}
      </div>
    );
  }
}

export default Index;
