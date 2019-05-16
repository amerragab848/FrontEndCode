import React, { Component, Fragment } from 'react';
import Api from '../../api';
import { Bar, GroupedBar, Tooltip, ResponsiveContainer, withResponsiveness } from 'britecharts-react'


const marginObject = {
    left: 40,
    right: 40,
    top: 50,
    bottom: 50,
};
const colorSchema = ["#39bd3d", "#dfe2e6"]
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

                this.setState({
                    isLoading: true
                });
                results.map((item) => {
                    barData.push({ 'value': item[this.props.y], 'name': item[this.props.catagName] })
                    return null;
                });
                this.setState({ isLoading: false, barData: barData });
            }
            else {
                let groupedBarData = []

                this.setState({
                    isLoading: true
                });
                this.props.barContent.map((bar) => {
                    results.map((obj) => {
                        groupedBarData.push({ stack: bar.value, total: obj[bar.value], name: obj[this.props.catagName] })
                        return null;
                    })
                    return null;
                })

                this.setState({
                    isLoading: false, groupedBarData: groupedBarData
                });
            }

        }).catch((ex) => {

            this.setState({
                isLoading: false
            });
        });
    }

    render() {
        return (
            <Fragment>
                {this.props.multiSeries !== 'no' ?
                    <div className="col-md-8 col-lg-6">
                        <div className="panel barChart__container">
                            <div className="panel-body">
                                <h2>
                                    {this.props.title}
                                </h2>
                                {this.state.isLoading == false ?
                                    <ResponsiveContainer
                                        render={
                                            ({ width }) =>
                                                <div className="group__charts">
                                                    <GroupedBar
                                                        data={this.state.groupedBarData}
                                                        width={width}
                                                        groupLabel='stack'
                                                        nameLabel='name'
                                                        valueLabel='total'
                                                        colorSchema={colorSchema}
                                                    />
                                                </div>
                                        }
                                    />
                                    : null}
                            </div>
                        </div>
                    </div>
                    :
                    this.state.isLoading == false ?
                        <div className="col-md-8 col-lg-6">
                            <div className="panel barChart__container">
                                <div className="panel-body">
                                    <h2>
                                        {this.props.title}
                                    </h2>
                                    <ResponsiveContainer
                                        render={
                                            ({ width }) =>
                                                <div>
                                                    <Bar
                                                        width={width}
                                                        data={this.state.barData}
                                                        isHorizontal={false}
                                                        margin={marginObject}
                                                        colorSchema={colorSchema}

                                                    />
                                                </div>
                                        }
                                    />
                                </div>
                            </div>
                        </div >
                        : null
                }


            </Fragment >
        );
    }
}

export default BarChartComp;
