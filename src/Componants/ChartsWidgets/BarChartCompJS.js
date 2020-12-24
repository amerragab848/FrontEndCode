import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import Api from '../../api';
import Loader from '../../../src/Styles/images/ChartLoaders/BarChartLoader.webm';
import NoData from '../../../src/Styles/images/ChartLoaders/BarChartNoData.png';

const colorSchema = [
    '#39bd3d',
    '#dfe2e6',
    '#ab50df',
    '#39bdef',
    '#afe5ef',
    '#522e5f',
    '#39bd3d',
    '#dfe2e6',
    '#ab50df',
    '#39bdef',
    '#afe5ef',
    '#522e5f',
];

class BarChartCompJS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: {},
            isLoading: true,
            chartDatasets: [],
            chartLabels: [],
            noData: false,
        };
    }

    componentDidMount() {
        if (this.props.reports === undefined) {
            Api.get(this.props.api, undefined, 3).then(results => {
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
                chartLabels.push(item[this.props.categoryName]);
                return null;
            });
            if (chartDatasets.length === 1)
                this.options.dataset.barPercentage = 0.5;
            this.setState({
                chartLabels,
                chartDatasets,

                isLoading: false,
                noData: chartDatasets.length > 0 ? false : true,
                chartData: {
                    labels: chartLabels,
                    datasets: [
                        {
                            backgroundColor:
                                chartDatasets.length > 1
                                    ? colorSchema
                                    : colorSchema[0],
                            borderColer:
                                chartDatasets.length > 1
                                    ? colorSchema
                                    : colorSchema[0],
                            borderWidth: 2,
                            data: chartDatasets,
                        },
                    ],
                },
            });
        }
    };

    options = {
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
        title: {
            display: false,
            text: this.props.title,
        },
        legend: {
            display: false,
        },
        animation: {
            duration: 1500,
        },
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            yAxes: [
                {
                    ticks: {
                        min: 0,
                    },
                },
            ],
            xAxes: [
                {
                    gridLines: {
                        display: false,
                    },
                },
            ],
        },
        dataset: {
            barPercentage: 0.9,
        },
    };

    render() {
        if (this.state.isLoading) {
            return (
                <div className="panel">
                    <div className="panel-body-loader">
                        <h2>{this.props.title}</h2>
                        <video style={{ width: '80%' }} autoPlay loop muted>
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
                        <img src={NoData} style={{ width: '80%' }} />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="panel">
                    <div className="panel-body">
                        <h2>{this.props.title}</h2>
                        <Bar
                            key={this.props.ukey}
                            data={this.state.chartData}
                            options={this.options}
                        />
                    </div>
                </div>
            );
        }
    }
}
export default BarChartCompJS;
