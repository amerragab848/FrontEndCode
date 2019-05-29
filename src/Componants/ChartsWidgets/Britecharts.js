import React, { Component } from 'react'
import Api from '../../api';
import { Line, Tooltip, withResponsiveness } from 'britecharts-react'
import '../../../node_modules/britecharts-react/node_modules/britecharts/dist/css/britecharts.css'
const ResponsiveLineChart = withResponsiveness(Line);

const _ = require('lodash')

const marginObject = {
    left: 100,
    right: 40,
    top: 100,
    bottom: 50,
};

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
                        dates: []
                    }]
            }
        }
    }

    renderLine = (props) => (
        <ResponsiveLineChart
            margin={marginObject}
            lineCurve="basis"
            {...props}
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
        });
    }
    render() {
        return (
            <div className="col-md-12 col-lg-6">
                <div className="panel barChart__container">
                    <div className="panel-body">
                        <h2>
                            {this.props.title}
                        </h2>
                        {this.state.isLoading === false ?
                            <Tooltip
                                data={this.state.data}
                                render={this.renderLine}
                                topicLabel="topics"
                                title="Tooltip Title"
                            /> : null
                        }
                    </div>
                </div>
            </div>
        )
    }

}
export default Britecharts