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

class BarChartComp extends Component {
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

    componentDidMount = () => {
        let barData = [];
        Api.get(this.props.api)
            .then(results => {
                if (this.props.multiSeries === 'no') {
                    this.GenerateDataFromProps(results);
                } else {
                    this.GenerateGroupedDataFromProps(results);
                }
            })
            .catch(ex => {
                this.setState({
                    isLoading: false,
                });
            });
    };

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
            this.setState({
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

    GenerateGroupedDataFromProps = results => {
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

export default BarChartComp;
