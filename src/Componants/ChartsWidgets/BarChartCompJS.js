import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import Api from '../../api';
import Loader from '../../../src/Styles/images/ChartLoaders/BarChartLoader.webm';

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
            datasetLabel: '',
        };
    }

    componentDidMount() {
        if (this.props.reports === undefined) {
            Api.get(this.props.api).then(results => {
                if (results) this.GenerateDataFromProps(results);
            });
        } else chartData: this.GenerateDataFromProps(this.props.rows);
    }

    GenerateDataFromProps = results => {
        if (results) {
            let chartDatasets = [];
            let chartLabels = [];
            let datasetLabel = '';
            results.map(item => {
                chartDatasets.push(item[this.props.y]);
                chartLabels.push(item[this.props.categoryName]);
                datasetLabel = this.props.title;
                return null;
            });
            if (chartDatasets.length === 1)
                this.options.scales.xAxes[0].barPercentage = 0.5;
            this.setState({
                shrinkBar: chartDatasets.length === 1,
                chartLabels,
                chartDatasets,
                datasetLabel: datasetLabel,

                isLoading: false,
                chartData: {
                    labels: chartLabels,
                    datasets: [
                        {
                            label: datasetLabel,
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
export default BarChartCompJS;
