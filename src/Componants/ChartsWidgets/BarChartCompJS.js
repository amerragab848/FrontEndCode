import React, { Component, Fragment } from 'react';
import Api from '../../api';
//import { Bar, GroupedBar, Tooltip, ResponsiveContainer } from 'britecharts-react'
//import '../../../node_modules/britecharts-react/node_modules/britecharts/dist/css/britecharts.css'
//import '../../../node_modules/britecharts-react/node_modules/britecharts/dist/css/britecharts.min.css'

//https://github.com/eventbrite/britecharts/blob/master/demos/src/demo-bar.js


const miniTooltip = require('../../../node_modules/britecharts/src/charts/mini-tooltip');

const d3 = require('d3-selection');

const britecharts = require('britecharts');

const marginObject = {
    left: 0,
    right: 40,
    top: 50,
    bottom: 50,
};

const colorSchema = ["#39bd3d", "#dfe2e6"]

class BarChartCompJS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barData: [],
            isLoading: true,
            groupedBarData: [],
        }
    }

    drawBarChart(barData) {

    }

    drawGroupedBarChart(groupedBarData) {

    }

    componentDidMount = () => {

        let barData = [];
        Api.get(this.props.api).then(results => {
            if (this.props.multiSeries === 'no') {

                results.map((item) => {
                    barData.push({ 'value': item[this.props.y], 'name': item[this.props.catagName] })
                    return null;
                });

                this.setState({
                    isLoading: false
                });

                let BarData = { data: barData }
                let contDiv = '.js-bar-chart-container-tooltip-container.' + this.props.ukey;
                let barChart = britecharts.bar(),
                    chartBarTooltip = miniTooltip(),
                    barContainer = d3.select(contDiv),
                    containerBarWidth = barContainer.node() ? barContainer.node().getBoundingClientRect().width : false;

                if (containerBarWidth) {
                    d3.select('.js-download-button').on('click', function () {
                        barChart.exportChart('barchart.png', 'Britecharts Bar Chart');
                    });
                }

                barChart.width(containerBarWidth) 
                    //.shouldShowLoadingState(barData.length ? false : true)
                    .margin(marginObject)
                    .colorSchema(colorSchema)
                    .isAnimated(true)
                    .height(containerBarWidth / 2)
                    .hasPercentage(true)
                    .on('customMouseOver', function () {
                        chartBarTooltip.show();
                    })
                    .on('customMouseMove', function (dataPoint, topicColorMap, x, y) {
                        chartBarTooltip.update(dataPoint, topicColorMap, x, y);
                    })
                    .on('customMouseOut', function (e) {
                        chartBarTooltip.hide();
                    });
                barContainer.datum(BarData.data).call(barChart);
                barContainer = d3.select('.js-bar-chart-container-tooltip-container .metadata-group');
                barContainer.datum([]).call(chartBarTooltip);

            }
            else {
                let groupedBarData = []

                this.props.barContent.map((bar) => {
                    results.map((obj) => {
                        groupedBarData.push({ stack: bar.value, total: obj[bar.value], name: obj[this.props.catagName] })
                        return null;
                    })
                    return null;
                })

                let groupedData = { data: groupedBarData }

                var groupedBarChart = britecharts.groupedBar(),
                    chartTooltip = britecharts.tooltip(),
                    container = d3.select('.js-grouped-bar-chart-tooltip-container.' + this.props.ukey),
                    containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
                    tooltipContainer;

                groupedBarChart.width(containerWidth)
                    .tooltipThreshold(600)
                   // .shouldShowLoadingState(groupedBarData.length ? false : true)
                    .colorSchema(colorSchema)
                    .height(containerWidth / 2)
                    .isAnimated(true)
                    .groupLabel('stack')
                    .nameLabel('name')
                    .valueLabel('total')
                    .on('customMouseOver', function () {
                        chartTooltip.show();
                    })
                    .on('customMouseMove', function (dataPoint, topicColorMap, x, y) {
                        chartTooltip.update(dataPoint, topicColorMap, x, y);
                    })
                    .on('customMouseOut', function () {
                        chartTooltip.hide();
                    });

                container.datum(groupedData.data).call(groupedBarChart);

                chartTooltip
                    .topicLabel('values')
                    .dateLabel('key')
                    .nameLabel('stack')
                    .title('Procoor tooltip');

                tooltipContainer = d3.select('.js-grouped-bar-chart-tooltip-container .metadata-group');
                tooltipContainer.datum([]).call(chartTooltip);

                this.setState({
                    isLoading: false
                });
            }

        });

    }

    render() {
        return (
            this.props.multiSeries !== 'no' ?
                <div className="col-md-12 col-lg-6">
                    <div className="panel barChart__container">
                        <div className="panel-body">
                            <h2>
                                {this.props.title}
                            </h2>
                            <div className={"britechart js-grouped-bar-chart-tooltip-container " + this.props.ukey + " card--chart"}></div>

                        </div>
                    </div>
                </div>
                :
                <div className="col-md-12 col-lg-6">
                    <div className="panel barChart__container">
                        <div className="panel-body">
                            <h2>
                                {this.props.title}
                            </h2>
                            <div className={"js-bar-chart-container-tooltip-container " + this.props.ukey + ' card--chart '}></div>
                        </div>
                    </div>
                </div>


        );
    }
}

export default BarChartCompJS;
