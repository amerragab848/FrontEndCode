import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import Api from '../../api';
import Loader from '../../../src/Styles/images/ChartLoaders/BarChartLoader.webm';

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

class GroupedBarCahrtComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: {},
            isLoading: true,
            chartDatasets: [],
            chartLabels: [],
        };
    }

    componentDidMount() {
        if (this.props.reports === undefined) {
            Api.get(this.props.api).then(results => {
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
                    barPercentage: 0.9,
                    gridLines: {
                        display: false,
                    },
                },
            ],
        },
    };
    render() {
        return this.state.isLoading ? (
            <div className="panel">
                <div className="panel-body-loader">
                    <h2>{this.props.title}</h2>
                    <video style={{ width: '80%' }} autoPlay loop muted>
                        <source src={Loader} type="video/webm" />
                    </video>
                </div>
            </div>
        ) : (
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

export default GroupedBarCahrtComponent;
