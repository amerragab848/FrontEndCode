import React, { Component } from 'react';
import Api from '../../api';
import { Bar } from 'britecharts-react'
const miniTooltip = require('britecharts/src/charts/mini-tooltip');

const d3 = require('d3-selection');

const britecharts = require('britecharts');
const NUMBER_FORMAT = ',f';
const marginObject = {
    left: 0,
    right: 40,
    top: 50,
    bottom: 50,
};

const colorSchema = ["#39bd3d", "#dfe2e6", "#ab50df"]

class BarChartCompJS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            barData: [],
            isLoadingGrouped: true,
            isLoadingBar: true,
            groupedBarData: [],
            xAxis: {}
        }

        this._isMounted = false;
    }

    componentDidMount = () => {

        this._isMounted = true;
        if (this.props.multiSeries === 'no') {
            this._isMounted && this.setState({
                isLoadingBar: true
            });
        } else {
            this._isMounted && this.setState({
                isLoadingGrouped: true
            });
        }

        if (this.props.reports == undefined) {
            Api.get(this.props.api).then(results => {
                if (results)
                    this.GenerateDataFromProps(results);
            });
        }
        else
            this.GenerateDataFromProps(this.props.rows)
    }

    GenerateDataFromProps = (results) => {
        let barData = [];
        if (this.props.multiSeries === 'no') {
            if (results) {
                results.map((item) => {
                    barData.push({ 'value': item[this.props.y], 'name': item[this.props.categoryName] })
                    return null;
                });
            }

            let BarData = { data: barData }
            let contDiv = '.js-bar-chart-container-tooltip-container-' + this.props.ukey;
            let barChart = britecharts.bar(),
                chartBarTooltip = miniTooltip(),
                barContainer = d3.select(contDiv),
                containerBarWidth = barContainer.node() ? barContainer.node().getBoundingClientRect().width : false;

            if (containerBarWidth) {
                d3.select('.js-download-button').on('click', function () {
                    barChart.exportChart('barchart.png', 'Britecharts Bar Chart');
                });
            }
            barChart
                .width(containerBarWidth)
                .margin(marginObject)
                .colorSchema(colorSchema)
                .isAnimated(true)
                .height(400)
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
            barContainer = d3.select('.js-bar-chart-container-tooltip-container-' + this.props.ukey + ' .metadata-group');
            barContainer.datum([]).call(chartBarTooltip);
            this._isMounted && this.setState({
                isLoadingBar: false
            });

        }
        else {
            let groupedBarData = []
            this.props.barContent.map((bar) => {
                if (results) {
                    results.map((obj) => {
                        groupedBarData.push({
                            stack: bar.name,
                            name: obj[this.props.categoryName],
                            total: obj[bar.value]
                        })
                    })
                }
            });
            let groupedData = { data: groupedBarData }
            var groupedBarChart = britecharts.groupedBar(),
                chartTooltip = britecharts.tooltip(),
                container = d3.select(".js-grouped-bar-chart-tooltip-container--" + this.props.ukey),
                containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
                tooltipContainer;

            groupedBarChart
                .width(containerWidth)
                .height(400)
                .groupLabel('stack')
                .nameLabel('name')
                .valueLabel('total')
                .grid('horizontal')
                .colorSchema(colorSchema)
                .valueLabelFormat(NUMBER_FORMAT)
                //.betweenBarsPadding(0.1)
                .isAnimated(true)
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
            tooltipContainer = d3.select('.js-grouped-bar-chart-tooltip-container--' + this.props.ukey + ' .metadata-group');

            tooltipContainer.datum([]).call(chartTooltip);

            this._isMounted && this.setState({
                isLoadingGrouped: results.length > 0 ? false : true,
                groupedBarData: groupedBarData
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            this.props.multiSeries == 'yes' ?
                <div className="col-md-12 col-lg-6">
                    <div className="panel barChart__container">
                        <div className="panel-body">
                            <h2>
                                {this.props.title}
                            </h2>
                            <div id={this.props.ukey} key={this.props.ukey}
                                className={"britechart js-grouped-bar-chart-tooltip-container--" + this.props.ukey + " card--chart"}></div>
                            {this.state.isLoadingGrouped === true ?
                                <Bar shouldShowLoadingState={true} /> : null
                            }
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
                            <div key={this.props.ukey} className={"js-bar-chart-container-tooltip-container-" + this.props.ukey + ' card--chart '}></div>

                            {this.state.isLoadingBar === true ?
                                <Bar shouldShowLoadingState={true} /> : null
                            }
                        </div>
                    </div>
                </div>
        );
    }
}

export default BarChartCompJS;
