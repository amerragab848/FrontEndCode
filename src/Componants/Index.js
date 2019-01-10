import React, { Component } from 'react';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";


import "../Styles/scss/en-us/dashboard.css";

import { WidgetData, Widgets, WidgetsWithText } from './CounterWidget';
import { ChartWidgetsData, BarChartComp, PieChartComp } from './ChartsWidgets';

import { ThreeWidgetsData, ApprovedWidget } from './ThreeWidgets';
 
import language from '../resources.json'; 
let currentLanguage = localStorage.getItem('lang')==null? 'en' : localStorage.getItem('lang');

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0,
            value: 0,
            counterData: [],
            counterDataDetails: [],
            chartData: ChartWidgetsData,
            threeWidgets:ThreeWidgetsData
        };
    }

    componentWillMount() { 
        this.setState({
            counterData: WidgetData.Widgets,
            counterDataDetails: WidgetData.CounterWidgetsWithDetails
        });
    };

    renderCounter() {
        let component = this.state.counterData.map(widget =>
            <Widgets 
				key={widget.id} 
				title={widget.title}
				api={widget.api}
                value={widget.value}
                apiDetails={widget.apiDetails} />
        );

        return component;
    };

    renderCounterDetails() {
        let component = this.state.counterDataDetails.map(widgetDetails =>
            <WidgetsWithText 
				key={widgetDetails.id} 
				title={widgetDetails.title} 
				value={widgetDetails.value} 
				total={widgetDetails.total}
				api={widgetDetails.api} 
	        	apiDetails={widgetDetails.apiDetails}  />
        );

        return component;
    };

    renderCharts() {
        let chartWidgets = this.state.chartData.map((item, index) => {

            if (item.type === 'pie') {
                return (
                    <div className="col-xs-5 mb-3" key={item.id}>
		            <PieChartComp api={item.props.api} name={item.props.name } 
		            y={item.props.y} 
		            title={ language[item.title][currentLanguage] } 
		            seriesName={ language[item.seriesName][currentLanguage] }></PieChartComp>
		          </div>
                )
            } else {
                return (
                    <div className="col-xs-5" key={item.id}>
		            <BarChartComp api={item.props.api} name={item.props.name} y={item.props.data} 
		              title={language[item.title][currentLanguage] }
		              stack={item.stack} yTitle={language[item.yTitle][currentLanguage]} catagName={item.catagName} multiSeries={item.multiSeries}
		              barContent={item.barContent} ></BarChartComp>
		          </div>
                );
            }
        });

        return chartWidgets;
    };
 
    renderThreeCard(){

        let ThreeCard = (
            <div className="row">
                {this.state.threeWidgets.map((panel, i) => {
                  
                    return (
                        <ApprovedWidget
                            key={panel.id}
                            title={language[panel.title][currentLanguage]}
                            value={panel.props.value}
                            text={panel.props.listType}
                            route={panel.props.route}
                            api={panel.props.api}
                            isModal={panel.props.isModal}
                        />
                    );
                })}
            </div>
        );
        return ThreeCard;
    }
    render() {

        return (
            <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })} >
					    <TabList>
					      <Tab> Summaries</Tab>
					      <Tab> PM Counters</Tab>
					      <Tab> Charts</Tab>
					    </TabList>

					    <TabPanel>
 						{this.renderThreeCard()}
 					    </TabPanel>

					    <TabPanel>
                            <div className="SummeriesContainer">
                            <div className="SummeriesContainerContent">      
                                {this.renderCounter()}
                                {this.renderCounterDetails()}
                            </div>	 
                            </div>
					    </TabPanel>

					    <TabPanel className="App container" > 
						     <div className="row"  > 
						    	{this.renderCharts()}
						    </div>
					    </TabPanel>
					</Tabs>
        );
    }
}

export default Index;