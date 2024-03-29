import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import Api from '../../api';
import Config from '../../Services/Config.js';
import Loader from '../../../src/Styles/images/ChartLoaders/LineChartLoader.webm';
import NoData from '../../../src/Styles/images/ChartLoaders/LineChartNoData.png';
import moment from 'moment';

const colorSchema = [
    '#39bd3d',
    '#ab50df',
    '#dfe2e6',
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
let moduleId = Config.getPublicConfiguartion().dashboardApi;
class Britecharts extends Component {
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
        Api.get(this.props.api, undefined, moduleId).then(results => {
            if (results) this.GenerateDataFromProps(results);
        });
    }

    GenerateDataFromProps = results => {
        if (results) {
            let chartDatasets = [];
            let chartLabels = [];
            let singleDataset = [];
            results.map(item => {
                let labelMarker = this.props.datasets[0];
                if (item.topicName === labelMarker) chartLabels.push(item.date);
                return null;
            });
            this.props.datasets.map((dataset, index) => {
                results.map(item => {
                    if (item.topicName === dataset)
                        singleDataset.push(item.value);
                    return null;
                });
                if (singleDataset.length > 0) {
                    chartDatasets.push({
                        label: dataset,
                        data: singleDataset,
                        borderColor:
                            index / 2 === 0 ? colorSchema[0] : colorSchema[1],
                        backgroundColor: 'white',
                        pointRadius: 5,
                        pointHoverRadius: 6,
                        fill: false,
                    });
                }
                singleDataset = [];
                return null;
            });
            this.setState({
                chartLabels,
                chartDatasets,

                isLoading: false,
                noData: chartDatasets.length > 0 ? false : true,
                chartData: {
                    labels: chartLabels,
                    datasets: chartDatasets,
                },
            });
        }
    };

    options = {
        tooltips: {
            xPadding: 12,
            yPadding: 12,
            bodySpacing: 12,
            mode: 'nearest',
            intersect: false,
            axis: 'x',
            titleFontSize: 18,
            bodyFontSize: 16,
            callbacks: {
                title: (tooltipItems, data) => {
                    return (
                        this.props.title +
                        ': ' +
                        moment.utc(tooltipItems[0].xLabel).format('DD-MM-YYYY')
                    );
                },
            },
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
                        precision: 2,
                    },
                    stacked: true,
                },
            ],
            xAxes: [
                {
                    type: 'time',
                    time: {
                        unit: 'month',
                    },
                    gridLines: {
                        display: false,
                    },
                },
            ],
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
                        <Line
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

export default Britecharts;
