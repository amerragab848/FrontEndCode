import React, { Component } from 'react'
import { Line, Tooltip, ResponsiveContainer, withResponsiveness } from 'britecharts-react'
//const {Line, Tooltip, ResponsiveContainer, withResponsiveness} = window['britecharts-react'];
import '../../../node_modules/britecharts-react/node_modules/britecharts/dist/css/britecharts.css'
const ResponsiveLineChart = withResponsiveness(Line);


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
            dataByTopic: []
        }

    }
    oneSet = () => ({
        ...this.state.dataByTopic
    });

    renderLine = (props) => (
        <ResponsiveLineChart
            margin={marginObject}
            lineCurve="basis"
            {...props}
        />
    );

    componentWillReceiveProps(props) {
        if (props) {
            let dataByTopic = []
            props.topicName.forEach(topic => {
                let dates = []
                let topicObject = {
                    topicName: topic
                }
                props.data.forEach(item => {
                    if (item.topicName) {
                        dates.push({
                            value: item.value,
                            date: item.date
                        })
                    }
                })
                topicObject.dates = dates;
                dataByTopic.push(topicObject)

            });
            this.setState({ dataByTopic })
        }
    }
    render() {
        return (
            <Tooltip
                data={this.oneSet()}
                render={this.renderLine}
                topicLabel="topics"
                title="Tooltip Title"
            />
        )
    }

}
export default Britecharts