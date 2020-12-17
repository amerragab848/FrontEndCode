import React, { Component } from 'react';
import Loader from '../../../Styles/images/ChartLoaders/BarChartLoader.webm';
import NoData from '../../../Styles/images/ChartLoaders/BarChartNoData.png';
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
            noData: false,
        };
    }

    componentWillReceiveProps(props) {
        this.GenerateDataFromProps(props.series);
    }

    GenerateDataFromProps = props => {
        if (props) {
            let chartDatasets = [];
            let labels = [];
            let data = [];
            let colors = [];
            let chartLabels = [];
            props.map(item => {
                chartLabels.push(item.name);
                return null;
            });
            props.map((dataset, index) => {
                labels.push(dataset.name);
                data.push(dataset.total);
                colors.push(colorSchemaGroup[index]);
            });

            chartDatasets.push({ label: labels, data: data, backgroundColor: colors })
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

export default BarChartComp;
