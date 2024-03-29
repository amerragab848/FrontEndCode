import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import Api from '../../api';
import Config from '../../Services/Config.js'; 
import Loader from '../../../src/Styles/images/ChartLoaders/BarChartLoader.webm';
import NoData from '../../../src/Styles/images/ChartLoaders/BarChartNoData.png';

const colorSchema = [
    '#39bd3d',
    '#ab50df',

    '#39bd3d',
    '#ab50df',

    '#39bd3d',
    '#ab50df',

    '#39bd3d',
    '#ab50df',

    '#39bd3d',
    '#ab50df',

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
class GroupedBarCahrtComponent extends Component {
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
            Api.get(this.props.api, undefined, moduleId).then(results => {
                if (results) this.GenerateDataFromProps(results);
            });
        } else
            this.setState({
                chartData: this.GenerateDataFromProps(this.props.rows),
            });
    }

    GenerateDataFromProps = results => {
        if (results) {
            let chartDatasets = [];
            let chartLabels = [];
            results.map(item => {
                chartLabels.push(item[this.props.categoryName]);
                return null;
            });
            this.props.barContent.map((dataset, index) => {
                chartDatasets.push({
                    label: dataset.name,
                    data: results.map(item => item[dataset.value]),
                    backgroundColor:
                        index / 2 === 0 ? colorSchema[0] : colorSchema[1],
                });
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
            xPadding: 15,
            yPadding: 15,
            bodySpacing: 15,
            mode: 'nearest',
            intersect: false,
            axis: 'x',
            titleFontSize: 18,
            bodyFontSize: 16,
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

export default GroupedBarCahrtComponent;
