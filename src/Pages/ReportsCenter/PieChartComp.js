import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
//import Api from '../../api';
import 'chartjs-plugin-style';
import Loader from '../../../src/Styles/images/ChartLoaders/PieChartLoader.webm';

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

class PieChartComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: {},
            chartDatasets: [],
            chartLabels: [],
            isLoading: true,
            chartName: null,
            sectorPercentage: null,
            totalAmount: null,
            pieChartInst: null,
        };
    }

    componentWillReceiveProps(props) {
        if (props.series.length > 0)
            this.GenerateDataFromProps(props.series[0].data);
    }

    GenerateDataFromProps = results => {
        if (results) {
            let chartDatasets = [];
            let chartLabels = [];
            results.map(item => {
                chartDatasets.push(item.y);
                chartLabels.push(item.name);
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
            display: false,
        },
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

    setSectorPercentage = (data, totalAmount) => {
        return (totalAmount / data.reduce((a, b) => a + b, 0)) * 100;
    };

    render() {
        return this.state.isLoading ? (
            <div className="panel">
                <div className="panel-body-loader">
                    <h2>{this.props.title}</h2>
                    <video
                        width={this.props.width}
                        height={this.props.height}
                        autoPlay
                        loop
                        muted>
                        <source src={Loader} type="video/webm" />
                    </video>
                </div>
            </div>
        ) : (
            <div className="panel">
                <div className="panel-body">
                    <h2>{this.props.title}</h2>
                    <div className="chartContainer">
                        <div className="canvas-container">
                            <Doughnut
                                ref={reference =>
                                    (this.state.pieChartInst = reference)
                                }
                                data={this.state.chartData}
                                options={this.options}
                            />
                        </div>
                        <p id="legenbd__teext">
                            <span className="chartName">
                                {this.state.chartName}
                            </span>
                            <span className="percentage">
                                {parseFloat(
                                    this.state.sectorPercentage,
                                ).toFixed(1) + '%'}
                            </span>
                            <span className="totalAmount">
                                {Math.round(this.state.totalAmount).toString()}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default PieChartComp;
