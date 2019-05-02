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
class PieChartComp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataChart: [],
            isLoading: true,
            highlightedSlice: null
        }

    }
    componentDidMount() {
        // this.abortController = new AbortController();

        // let signal = this.abortController.signal;

        let dataChart = [];

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
        });
    }

    componentWillUnmount() {
        // this.abortController.abort();
    }
    // _handleMouseOver(data) {
    //     this.setState({
    //         highlightedSlice: this.state.dataChart.id
    //     });
    // }

    // _handleMouseOut() {
    //     this.setState({
    //         highlightedSlice: 99999
    //     });
    // }
    render() {
        return (
            <div className="panel">
                <div className="panel-body">
                    <h2>
                        {this.props.title}
                    </h2>
                    {this.state.isLoading == false ?
                        <ResponsiveContainer
                            render={
                                ({ width }) =>
                                    <div>
                                        <Donut
                                            data={this.state.dataChart}
                                            height={width / 2}
                                            width={width / 2}
                                            externalRadius={width / 4}
                                            internalRadius={width / 10}
                                            highlightSliceById={this.state.highlightedSlice}
                                            colorSchema={colorSchema}
                                            isAnimated={false}
                                            // customMouseOver={this._handleMouseOver.bind(this)}
                                            // customMouseOut={this._handleMouseOut.bind(this)}
                                            // hasHoverAnimation={true}
                                        />
                                        {/* <Legend
                                            data={this.state.dataChart}
                                            height={200}
                                            width={width}
                                            highlightEntryById={this.state.highlightedSlice}
                                        /> */}
                                    </div>
                            }

                        />
                        : null}

                </div>
            </div>
        );
    }
}

export default PieChartComp;
