import React, { Component, Fragment } from 'react';

import { Donut, Legend } from 'britecharts-react'

import Api from '../../api';
// const logMouseOver = () => console.log('Mouse Over');

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
    //       highlightedSlice: data.data.id
    //     });
    //     console.log('fdnknvk')
    //   }
  
    //   _handleMouseOut() {
    //     this.setState({
    //       highlightedSlice: 99999
    //     });
    //   }
    render() {
        return (
            <div className="panel">
                <div className="panel-body">
                    <h2>
                        {this.props.title}
                    </h2>
                    {this.state.isLoading == false ?
                        <Fragment>
                            <Donut
                                data={this.state.dataChart}
                                externalRadius={350 / 2.5}
                                internalRadius={350 / 5}
                                colorSchema={colorSchema}
                                width={300}
                                height={300}
                                isAnimated={true}
                                loadingState={true}
                                //customMouseOver={this._handleMouseOver.bind(this)}
                                //customMouseOut={this._handleMouseOut.bind(this)}
                            />
                            <Legend
                                data={this.state.dataChart}
                                colorSchema={colorSchema}
                                isHorizontal={true}
                                markerSize={6}
                                marginRatio={1.7}
                                width={500}
                                height={100}
                                highlightEntryById={this.state.highlightedSlice}
                            />
                        </Fragment>
                        : null}
                </div>
            </div>
        );
    }
}

export default PieChartComp;
