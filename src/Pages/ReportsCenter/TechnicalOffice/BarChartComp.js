import React, { Component } from 'react';
import Loader from '../../../Styles/images/ChartLoaders/BarChartLoader.webm';
import { Bar } from 'react-chartjs-2';

const colorSchemaGroup = ['#90ED7D', '#f45b4f', '#95ceff', '#90000f'];

class BarChartComp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chartDatasets: [],
            chartLabels: [],
            chartData: [],
            isLoading: true,
        };
    }

    componentWillReceiveProps(props) {
        console.log(props.series);
        this.GenerateDataFromProps(props.series);
    }

    GenerateDataFromProps = props => {
        if (props) {
            let chartDatasets = [];
            let chartLabels = [];
            let singleDataset = [];
            let stacks = [];
            props.map(dataset => {
                if (!chartLabels.includes(dataset.name))
                    chartLabels.push(dataset.name);
                if (!stacks.includes(dataset.stack)) stacks.push(dataset.stack);
                return null;
            });
            console.log(stacks, chartLabels);

            stacks.forEach((stack, index) => {
                props.forEach(item => {
                    if (item.stack === stack) {
                        singleDataset.push(item.total);
                        console.log('stack: ', stack, 'item: ', item);
                    }
                });
                chartDatasets.push({
                    label: stacks[index],
                    data: singleDataset,
                    backgroundColor: colorSchemaGroup[index],
                });
                singleDataset = [];
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
            console.log(this.state.chartData);
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
                    stacked: this.props.isStacked,
                },
            ],
            xAxes: [
                {
                    barPercentage: 0.9,
                    gridLines: {
                        display: false,
                    },
                    stacked: this.props.isStacked,
                },
            ],
        },
    };

    render() {
        return this.state.isLoading ? (
            <div className="col-md-12">
                <div className="panel">
                    <div className="panel-body-loader">
                        <h2>{this.props.title}</h2>
                        <video
                            style={{ width: '80%' }}
                            width={this.props.width}
                            height={this.props.height}
                            autoPlay
                            loop
                            muted>
                            <source src={Loader} type="video/webm" />
                        </video>
                    </div>
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
