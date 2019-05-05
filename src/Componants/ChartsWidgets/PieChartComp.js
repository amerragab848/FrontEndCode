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
// let logMouseOver = (e) => {
//     let data = e.data;
//     console.log(e.data);

//     return (
//         <p id="legenbd__teext"><span className="chartName"> {data.name}</span>
//             <span className="percentage">{data.percentage + '%'}</span>
//             <span className="totalAmount">{data.quantity}</span>
//         </p>
//     )

// };

class PieChartComp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataChart: [],
            isLoading: true,
            data: {},
            isAnimated: true
        }

    }
    componentDidMount() {

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

    logMouseOver = (e) => {
        // this.setState({
        //     data: e.data,
        //     isAnimated: false
        // })
        this.setState({
            data: e.data    
        });
        data = e.data;
        console.log(e.data);
        console.log(data);
    };

    // _handleMouseOut() {
    //     this.setState({
    //         highlightedSlice: 99999
    //     });
    // }

    // _handleMouse(e) {
    //     console.log('this.state.dataChart')
    //     console.log(this.state.dataChart)
    //     this.setState({ highlightedSlice: this.state.dataChart.id , showLegend :true})
    // }


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
                                        customMouseOver={this.logMouseOver}
                                    />

                                    <p id="legenbd__teext"><span className="chartName"> {this.state.data.name}</span>
                                        <span className="percentage">{this.state.data.percentage + '%'}</span>
                                        <span className="totalAmount">{this.state.data.quantity}</span>
                                    </p>

                                </div>
                        }

                    />

                </div>
            </div>
        );
    }
}

export default PieChartComp;
