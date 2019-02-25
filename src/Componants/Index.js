import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import LoadingSection from "../Componants/publicComponants/LoadingSection";
import "react-tabs/style/react-tabs.css";
import { WidgetData, Widgets, WidgetsWithText } from "./CounterWidget";
import { ChartWidgetsData, BarChartComp, PieChartComp } from "./ChartsWidgets";
import { ThreeWidgetsData, ApprovedWidget } from "./ThreeWidgets";
import DashBoard from './DashBoard';
import language from "../resources.json";
import Api from "../api";
let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

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
      viewMenu:0,
      isLoading:false
    };
  }

  componentWillMount() {
    this.setState({
      counterData: WidgetData.Widgets,
      counterDataDetails: WidgetData.CounterWidgetsWithDetails
    });
  }

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
          <div className="col-xs-4" key={item.id}>
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

  renderThreeCard() {
    let ThreeCard = (
      <div className="SummeriesContainer ">
        <div className="SummeriesContainerContent">
          {this.state.threeWidgets.map((panel, i) => {
            return panel.permission ? (
              <ApprovedWidget
                key={panel.id}
                {...panel}
                value={panel.props.value}
                text={panel.props.listType}
                title={language[panel.title][currentLanguage]}
              />
            ) : null;
          })}
        </div>
      </div>
    );
    return ThreeCard;
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

  render() {
    return (
      <div className="customeTabs">
        <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
          <TabList>
            <Tab> Summaries</Tab>
            <Tab> PM Counters</Tab>
            <Tab> Charts</Tab>
          </TabList>
          <TabPanel>{this.renderThreeCard()}</TabPanel>
          <TabPanel>
            <div className="SummeriesContainer">
              <div className="SummeriesContainerContent">
                {this.renderCounterDetails()} {this.renderCounter()}
              </div>
            </div>
          </TabPanel>
          <TabPanel className="App">
            <div className="row">{this.renderCharts()}</div>
          </TabPanel>
        </Tabs>
        <div className="customizeBtn" onClick={this.viewDashBoardHandler.bind(this)}>
          <button>Add</button>
        </div>
        {this.state.viewDashBoard ? <DashBoard  opened={this.state.viewDashBoard} closed={this.closeModal.bind(this)}/> : null}
      </div>
    );
  }
}

export default Index;
