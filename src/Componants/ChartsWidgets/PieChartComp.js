import React, { Component, Fragment } from 'react';

import { Donut, Legend, ResponsiveContainer, withResponsiveness } from 'britecharts-react'

import Api from '../../api';

const colorSchema = [
    '#07bc0c',
    '#119015',
    '#47cc4a',
    '#7cdb79',
    '#5fd45f',
    '#119015',
    '#07bc0cbb',
]

let data = {};

class PieChartComp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataChart: [],
            isLoading: true,
            data: {},
            isAnimated: true,
            showLegend: false,
            highlightedSlice: null
        }

    }
    componentDidMount() {

        let dataChart = [];
        this.setState({ isLoading: true });
        Api.get(this.props.api).then(res => {
            if (res) {
                res.map((obj, index) => {
                    dataChart.push({
                        quantity: obj[this.props.y],
                        name: obj[this.props.name],
                        id: index
                    });
                    return null;
                })
            }
            this.setState({ isLoading: false, dataChart: dataChart });

        }).catch((ex) => {
            console.log(ex);
            this.setState({ isLoading: false });
        });
    }

    _handleMouseOver = (e) => {
        this.setState({
            data: e.data,
            highlightedSlice: e.data.id,
            showLegend: true
        });
        data = e.data;
    };

    render() {

        return (
            <div className="panel">
                <div className="panel-body">
                    <h2>
                        {this.props.title}
                    </h2>
                    <ResponsiveContainer
                        render={
                            ({ width }) =>
                                <div className="donut__legend">
                                    <Donut
                                        data={this.state.dataChart}
                                        height={width / 2}
                                        width={width / 2}
                                        externalRadius={width / 4}
                                        internalRadius={width / 10}
                                        colorSchema={colorSchema}
                                        customMouseOver={this._handleMouseOver}
                                        customMouseMove={this.logMouseOver}
                                        highlightSliceById={this.state.highlightedSlice}
                                        isAnimated={false}
                                    />

                                    {this.state.showLegend === true ?
                                        <p id="legenbd__teext">
                                            <span className="chartName"> {this.state.data.name}</span>
                                            <span className="percentage">{this.state.data.percentage + '%'}</span>
                                            <span className="totalAmount">{this.state.data.quantity + 'LE'}</span>
                                        </p>
                                        : null}
                                </div>
                        }

                    />

                </div>
            </div>
        );
    }
}

export default PieChartComp;
