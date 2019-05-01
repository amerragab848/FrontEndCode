import React, { Component } from 'react';

import { Donut } from 'britecharts-react'

import Api from '../../api';
// const logMouseOver = () => console.log('Mouse Over');

class PieChartComp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataChart: [],
            isLoading: true
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

    render() {
        return (
            <div className="panel">
                <div className="panel-body">
                    <h2>
                        {this.props.title}
                    </h2>
                    {this.state.isLoading == false ?
                        <Donut
                            data={this.state.dataChart}
                            // customMouseOver={logMouseOver}
                            externalRadius={100}
                            internalRadius={47}
                            highlightSliceById={1}

                            colorSchema={["#6aedc7", "#39c2c9", "#ffce00", "#ffa71a", "#f866b9", "#998ce3"]}
                        />
                        : null}
                </div>
            </div>
        );
    }
}

export default PieChartComp;
