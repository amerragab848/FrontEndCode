import React, { Component, Fragment } from 'react';
import Api from '../../api';
import { Bar, GroupedBar } from 'britecharts-react'


const marginObject = {
    left: 100,
    right: 40,
    top: 100,
    bottom: 50,
};
 
class BarChartComp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataByTopic: {
                dataByTopic: [
                    {
                        topic: -1,
                        topicName: 'Vivid',
                        dates: []
                    }]
            },
            barData: [],
            isLoading: true,
            groupedBarData: []
        }
    }

    componentDidMount = () => {
        let barData = [];
        Api.get(this.props.api).then(results => {
            if (this.props.multiSeries === 'no') {
                results.map((item) => {
                    barData.push({ 'value': item[this.props.y], 'name': item[this.props.catagName] })
                    return null;
                });
                this.setState({ isLoading: false, barData: barData });
            }
            else {
                let groupedBarData = []
                this.props.barContent.map((bar) => {
                    results.map((obj) => {
                        groupedBarData.push({ stack: bar.value, total: obj[bar.value], name: obj[this.props.catagName] })
                        return null;
                    })

                    return null;
                })
                this.setState({
                    isLoading: false, 
                    groupedBarData: groupedBarData
                });
            }

        }).catch((ex) => {
        });
    }

    render() {
        return (
            <Fragment>
                {this.props.multiSeries !== 'no' ?
                    <div className="col-xs-8">
                        <div className="panel barChart__container">
                            <div className="panel-body">
                                {this.state.isLoading == false ?
                                    <GroupedBar
                                        data={this.state.groupedBarData}
                                        width={800}
                                        groupLabel='stack'
                                        nameLabel='name'
                                        valueLabel='total'
                                        margin={marginObject}
                                    />
                                    : null}
                            </div>
                        </div>
                    </div>
                    :
                    this.state.isLoading == false ?
                        <div className="col-xs-6">
                            <div className="panel barChart__container">
                                <div className="panel-body">
                                    <Bar
                                        data={this.state.barData}
                                        width={800}
                                        isHorizontal={false}
                                        margin={marginObject}
                                        colorSchema={["#dfe2e6", "#39bd3d"]}
                                        labelsSize={20}
                                        xAxisLabelOffset={5}
                                    />
                                </div>
                            </div >
                        </div >
                        : null
                }


            </Fragment >
        );
    }
}

export default BarChartComp;
