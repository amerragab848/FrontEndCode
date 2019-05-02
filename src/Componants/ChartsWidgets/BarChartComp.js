import React, { Component, Fragment } from 'react';
import Api from '../../api';
import { Bar, GroupedBar } from 'britecharts-react'


const marginObject = {
    left: 40,
    right: 40,
    top: 50,
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
                    <div className="col-md-8 col-lg-6">
                        <div className="panel barChart__container">
                            <div className="panel-body">
                                {this.state.isLoading == false ?
                                    <GroupedBar
                                        data={this.state.groupedBarData}
                                        width={650}
                                        groupLabel='stack'
                                        nameLabel='name'
                                        valueLabel='total'
                                        margin={marginObject}
                                        colorSchema={["#39bd3d", "#dfe2e6"]}
                                        yTickTextOffset={-65}
                                    />
                                    : null}
                            </div>
                        </div>
                    </div>
                    :
                    this.state.isLoading == false ?
                        <div className="col-md-8 col-lg-6">
                            <div id="ContainerWidth" className="panel barChart__container">
                                <div className="panel-body">
                                    <Bar
                                        data={this.state.barData}
                                        width={650}
                                        isHorizontal={false}
                                        margin={marginObject}
                                        colorSchema={["#dfe2e6", "#39bd3d"]}
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
