import React, { Component } from 'react';
import Api from '../../api';
import { Line, Tooltip, withResponsiveness, ResponsiveContainer } from 'britecharts-react';
import '../../../node_modules/britecharts-react/node_modules/britecharts/dist/css/britecharts.css';
const ResponsiveLineChart = withResponsiveness(Line);

const _ = require('lodash')

const marginObject = {
    left: 100,
    right: 40,
    top: 100,
    bottom: 50,
};

const colorSchema = ["#39bd3d", "#dfe2e6"]

class Britecharts extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            data: {
                dataByTopic: [
                    {
                        topic: -1,
                        topicName: 'Vivid',
                        dates: [{
                            date: null,
                            value: null
                        }]
                    }]
            }
        }
    }

    renderLine = (props) => (
        <ResponsiveContainer
            render={
                ({ width }) =>
                    <ResponsiveLineChart margin={marginObject} lineCurve="basis" height={400} width={width} colorSchema={colorSchema} grid='horizontal' {...props} />
            }
        />
    );

    componentDidMount() {
        let dataByTopic = [];

        this.setState({
            isLoading: true
        });

        Api.get(this.props.api).then(res => {
            if (res.length > 0) {
                this.props.topicName.forEach((topic, index) => {
                    let topics = _.filter(res, function (x) {
                        if (x.topicName == topic) {
                            return { date: x.date, value: x.value }
                        }
                    });
                    dataByTopic.push({
                        topic: index,
                        topicName: topic,
                        dates: topics
                    })
                });
            }

            let data = {
                dataByTopic: dataByTopic
            }

            this.setState({
                data: data,
                isLoading: false
            });

        }).catch((ex) => {
            this.setState({
                isLoading: false
            });
        });
    }
    render() {
        return (
            <div className="col-md-12 col-lg-6">
                <div className="panel barChart__container lineCharts">
                    <div className="panel-body">
                        <h2>
                            {this.props.title}
                        </h2>
                        {this.state.isLoading === false ?
                            <Tooltip
                                data={this.state.data}
                                render={this.renderLine}
                                topicLabel="topics"
                                title={this.props.title} />
                            :
                            <Line shouldShowLoadingState={true} />
                        }
                    </div>
                </div>
            </div>
        )
    }

}
export default Britecharts