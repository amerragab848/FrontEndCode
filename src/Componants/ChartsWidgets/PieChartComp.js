import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
import Api from '../../api';
import Config from '../../Services/Config.js';
import 'chartjs-plugin-style';
import Loader from '../../../src/Styles/images/ChartLoaders/PieChartLoader.webm';
import NoData from '../../../src/Styles/images/ChartLoaders/PieChartNoData.png';

const colorSchema = [
    '#07bc0c',
    '#119015',
    '#47cc4a',
    '#7cdb79',
    '#5fd45f',
    '#119015',
    '#07bc0c',
    '#07bc0c',
    '#119015',
    '#47cc4a',
    '#7cdb79',
    '#5fd45f',
    '#119015',
    '#07bc0c',
    '#07bc0c',
    '#119015',
    '#47cc4a',
    '#7cdb79',
    '#5fd45f',
    '#119015',
    '#07bc0c',
    '#119015',
    '#47cc4a',
    '#7cdb79',
];

let moduleId = Config.getPublicConfiguartion().dashboardApi;
class PieChartComp extends Component {
    constructor(props) {
        super(props);

        this.chartReference = React.createRef();

        this.state = {
            chartData: {},
            chartDatasets: [],
            chartLabels: [],
            isLoading: true,
            chartName: null,
            sectorPercentage: null,
            totalAmount: null,
            pieChartInst: null,
            noData: false,
        };
    }

    options = {
        onHover: (e, elements) => {
            let LegendName = this.state.chartName;
            let legendValue = this.state.totalAmount;

            if (elements.length) {
                let newlegendValue = this.state.chartData.datasets[0].data[
                    elements[0]._index
                ];

                let newLegend = this.state.chartData.labels[elements[0]._index];
                if (
                    LegendName !== newLegend ||
                    legendValue !== newlegendValue
                ) {
                    this.setState({
                        chartName: newLegend,
                        totalAmount: newlegendValue,
                        sectorPercentage: this.setSectorPercentage(
                            this.state.chartData.datasets[0].data,
                            this.state.chartData.datasets[0].data[
                            elements[0]._index
                            ],
                        ),
                    });
                }
            }
        },
        cutoutPercentage: 39,
        legend: {
            display: this.props.showLegend,
        },

        // legendCallback: function (chart) {
        //     var legendHtml = [];
        //     legendHtml.push('<ul>');
        //     var item = chart.data.datasets[0];
        //     console.log('legendCallback/.....')
        //     for (var i = 0; i < item.data.length; i++) {
        //         legendHtml.push('<li>');
        //         legendHtml.push('<span class="chart-legend" style="background-color:' + item.backgroundColor[i] + '"></span>');
        //         legendHtml.push('<span class="chart-legend-label-text">' + item.data[i] + '- ' + chart.data.labels[i] + ' </span>');
        //         legendHtml.push('</li>');
        //     }

        //     legendHtml.push('</ul>');
        //     return legendHtml.join("");
        // },
        animation: {
            duration: 1500,
        },
        tooltips: {
            xPadding: 15,
            yPadding: 15,
            bodySpacing: 15,
            mode: 'nearest',
            intersect: false,
            axis: 'x',
            titleFontSize: 18,
            bodyFontSize: 16,
        },
        responsive: true,
        maintainAspectRatio: true,
        elements: {
            arc: {
                borderWidth: 0,
            },
        },
    };

    componentDidMount() {
        if (this.props.reports == undefined) {
            Api.get(this.props.api, undefined, moduleId).then(results => {
                if (results) this.GenerateDataFromProps(results);
            });
        } else this.GenerateDataFromProps(this.props.rows);
    }

    GenerateDataFromProps = results => {
        if (results) {
            let chartDatasets = [];
            let chartLabels = [];
            results.map(item => {
                chartDatasets.push(item[this.props.y]);
                chartLabels.push(item[this.props.name]);
                return null;
            });
            this.setState({
                chartLabels,
                chartDatasets,
                chartName: chartLabels[0],
                totalAmount: chartDatasets[0],
                sectorPercentage: this.setSectorPercentage(
                    chartDatasets,
                    chartDatasets[0],
                ),
                isLoading: false,
                noData: chartDatasets.length > 0 ? false : true,
                chartData: {
                    labels: chartLabels,
                    datasets: [
                        {
                            backgroundColor: colorSchema,
                            data: chartDatasets,
                            hoverBackgroundColor: 'rgb(55 170 55)',
                            hoverInnerGlowWidth: 5,
                            hoverInnerGlowColor: 'rgb(55 170 55)',
                            hoverOuterGlowWidth: 40,
                            hoverOuterGlowWidth: 'rgb(55 170 55)',
                        },
                    ],
                },
            });
 

        }
    };

    setSectorPercentage = (data, totalAmount) => {
        var result = (parseInt(totalAmount) / data.reduce((a, b) => parseInt(a) + parseInt(b), 0)) * 100;
        return result;
    };

    render() {
       // let lg= this.chartReference.generateLegend()
        if (this.state.isLoading) {
            return (
                <div className="panel">
                    <div className="panel-body-loader">
                        <h2>{this.props.title}</h2>
                        <video style={{ width: '50%' }} autoPlay loop muted>
                            <source src={Loader} type="video/webm" />
                        </video>
                    </div>
                </div>
            );
        } else if (this.state.noData) {
            return (
                <div className="panel">
                    <div className="panel-body-loader">
                        <h2>{this.props.title}</h2>
                        <img src={NoData} style={{ width: '50%' }} />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="panel">
                    <div className="panel-body">
                        <h2>{this.props.title}</h2>
                        <div className="chartContainer">
                            <div className="canvas-container">
                                <Doughnut
                                    ref={this.chartReference}
                                    data={this.state.chartData}
                                    options={this.options}
                                /> 
                            </div>
                            <p id="legenbd__teext">
                                <span className="chartName">
                                    {this.state.chartName}
                                </span>
                                <span className="percentage">
                                    {isNaN(
                                        parseFloat(
                                            this.state.sectorPercentage,
                                        ).toFixed(1),
                                    )
                                        ? ''
                                        : parseFloat(
                                            this.state.sectorPercentage,
                                        ).toFixed(1) + '%'}
                                </span>
                                <span className="totalAmount">
                                    {Math.round(
                                        this.state.totalAmount,
                                    ).toString()}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default PieChartComp;
