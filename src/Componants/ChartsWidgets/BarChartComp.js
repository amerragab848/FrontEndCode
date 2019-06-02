import React, { Component, Fragment } from 'react';
import Api from '../../api';
// import * as d3 from 'd3';
import { Bar, GroupedBar, Tooltip, ResponsiveContainer } from 'britecharts-react'
import '../../../node_modules/britecharts-react/node_modules/britecharts/dist/css/britecharts.css'
const marginObject = {
    left: 0,
    right: 40,
    top: 50,
    bottom: 50,
};

const colorSchema = ["#39bd3d", "#dfe2e6"]

class BarChartComp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            barData: [],
            isLoading: true,
            groupedBarData: [],
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
    // logMouseOver = (e) => {
    //     Tooltip.show
    // };

    render() {
        const renderLine = (props) => (
            <ResponsiveContainer
                render={
                    ({ width }) =>
                        <div className="js-bar-chart-container-tooltip-container">

                            <Bar
                                isHorizontal={false}
                                margin={marginObject}
                                colorSchema={colorSchema}
                                width={width}

                                // percentageAxisToMaxRatio={1.3}

                                shouldShowLoadingState={this.state.barData.length ? false : true}
                                {...props}
                            />
                        </div>
                }
            />
        );
        return (
            <Fragment>
                {this.props.multiSeries !== 'no' ?
                    <div className="col-md-12 col-lg-6">
                        <div className="panel barChart__container">
                            <div className="panel-body">
                                <h2>
                                    {this.props.title}
                                </h2>
                                {this.state.isLoading == false ?
                                    <ResponsiveContainer
                                        render={
                                            ({ width }) =>
                                                <div className="group__charts ">
                                                    <GroupedBar
                                                        data={this.state.groupedBarData}
                                                        width={width}
                                                        groupLabel='stack'
                                                        nameLabel='name'
                                                        valueLabel='total'
                                                        colorSchema={colorSchema}
                                                        shouldShowLoadingState={this.state.groupedBarData.length ? false : true} />
                                                </div>
                                        }
                                    />
                                    : null}
                            </div>
                        </div>
                    </div>
                    :
                    this.state.isLoading == false ?
                        <div className="col-md-12 col-lg-6">
                            <div className="panel barChart__container">
                                <div className="panel-body">
                                    <h2>
                                        {this.props.title}
                                    </h2>
                                    <div>
                                        <Fragment>
                                            <ResponsiveContainer
                                                render={
                                                    ({ width }) =>
                                                        <Tooltip
                                                            data={this.state.barData}
                                                            render={renderLine}
                                                            topicLabel="topics"
                                                            title="Tooltip Title" />
                                                }
                                            /> </Fragment>
                                    </div>
                                </div>
                            </div>
                        </div >
                        : null
                }
            </Fragment>
        );
    }
}

export default BarChartComp;
