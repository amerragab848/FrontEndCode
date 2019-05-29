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
            dataByTopic: [
                {
                    topic: -1,
                    topicName: 'Vivid',
                    dates: []
                }]
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

        alert(this.props);
        let dataByTopic = [];
        this.setState({
            isLoading: true
        });
        Api.get(this.props.api).then(res => {
            if (res.length > 0) {
                this.props.topicName.forEach((topic, index) => {
                    let topics = _.filter(res, function (x) { return x.topicName == topic });
                    dataByTopic.push({
                        topic: index,
                        topicName: topic,
                        dates: topics
                    })
                });
            }

            this.setState({
                isLoading: false
            });
            this.setState({ dataByTopic });

        }).catch((ex) => {
        });
    }
    render() {
        return (

            this.state.isLoading === true ?
                <Tooltip
                    data={this.state.dataByTopic}
                    render={this.renderLine}
                    topicLabel="topics"
                    title="Tooltip Title"
                /> : null
        )
    }

}
export default Britecharts