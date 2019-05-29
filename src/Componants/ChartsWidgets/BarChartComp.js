import React, { Component, Fragment } from 'react';
import Api from '../../api';
import { Bar, GroupedBar, Tooltip, ResponsiveContainer, withResponsiveness, Line, ResponsiveStackedArea } from 'britecharts-react'


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
            groupedBarData: [],
            loadingState: false
        }
    }

    componentDidMount = () => {
        let barData = [];
        Api.get(this.props.api).then(results => {
            if (this.props.multiSeries === 'no') {

                this.setState({
                    isLoading: true
                });
                if (results == null) {
                    this.setState({ loadingState: true })
                } else {
                    this.setState({ loadingState: false })
                }
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
        const renderStackedArea = (props) => (
            <ResponsiveContainer
                render={
                    ({ width }) =>
                        <Bar
                            isHorizontal={false}
                            margin={marginObject}
                            colorSchema={colorSchema}
                            width={width}
                            data={this.state.barData}
                            customMouseOver={this.tooltip}
                            customMouseMove={this.tooltip}
                            customMouseOut={this.tooltip}
                            shouldShowLoadingState={this.state.loadingState === true ? true : false}
                        />
                }
            />
        );

        const TooltipWithStackedArea = ({ data }) => (
            <Tooltip
                data={this.state.barData}
                render={renderStackedArea}
            />
        );
        
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
                                    <div>
                                        <Fragment>
                                            <ResponsiveContainer
                                                render={
                                                    ({ width }) =>
                                                        // <Tooltip
                                                        //     data={this.state.barData}
                                                        //     render={renderLine}
                                                        //     topicLabel="topics"
                                                        //     title="Tooltip Title"
                                                        // />
                                                        <TooltipWithStackedArea
                                                            data={this.state.barData}
                                                        />
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
