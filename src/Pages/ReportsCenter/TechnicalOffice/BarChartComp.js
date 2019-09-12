import React, { Component, Fragment } from "react"; 
import {
  Bar,
  GroupedBar, 
  ResponsiveContainer, 
  StackedBar
} from "britecharts-react";

const marginObject = {
  left: 40,
  right: 40,
  top: 50,
  bottom: 50
};

const colorSchema = ["#39bd3d", "#dfe2e6"];

const colorSchemaGroup = ["#90ED7D", "#f45b4f", "#95ceff", "#90000f"];
 
class BarChartComp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      noClicks: null,
      dataByTopic: {
        dataByTopic: [
          {
            topic: -1,
            topicName: "Vivid",
            dates: []
          }
        ]
      },
      barData: [],
      isLoading: true,
      groupedBarData: [],
      stackedBarData: []
    };
  }

  componentWillReceiveProps(props) { 
 
    if (props.multiSeries === "no") {
      if (props.isStack === true) {
        this.setState({
          isLoading: false,
          stackedBarData: props.series != undefined ? props.series :[]
        });
      } else {
        let barData = [];

        props.series.map(item => {
          barData.push({ value: item["value"], name: item["name"] });
          return null;
        });
        this.setState({ isLoading: false, barData: barData });
      }
    } else {
      this.setState({
        isLoading: false,
        groupedBarData: props.series != undefined ? props.series : []
      });
    }
  }

  renderGroupedBar() {
    return (
      <div className="col-md-12">
        <div className="panel barChart__container">
          <div className="panel-body">
            {this.state.isLoading == false ? (
              <ResponsiveContainer
                render={({ width }) => (
                  <div className="group__charts">
                    <GroupedBar
                      data={this.state.groupedBarData}
                      width={width}
                      groupLabel="stack"
                      nameLabel="name"
                      valueLabel="total"
                      colorSchema={colorSchemaGroup}
                    />
                  </div>
                )}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  renderStackedBar() {
    return (
      <div className="col-md-12">
        <div className="panel barChart__container">
          <div className="panel-body">
            <ResponsiveContainer
              render={({ width }) => (
                <div> 
                  <StackedBar
                    width={width}
                    data={
                      this.state.stackedBarData != null
                        ? this.state.stackedBarData
                        : null
                    }
                    isHorizontal={false}
                    margin={marginObject}
                    colorSchema={colorSchema}
                  />
                </div>
              )}
            />
          </div>
        </div>
      </div>
    );
  }

  renderBar() {
    return (
      <div className="col-md-12">
        <div className="panel barChart__container">
          <div className="panel-body">
            <ResponsiveContainer
              render={({ width }) => (
                <div>
                  <Bar
                    width={width}
                    data={this.state.barData}
                    isHorizontal={false}
                    margin={marginObject}
                    colorSchema={colorSchema}
                  />
                </div>
              )}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Fragment>
        {this.props.multiSeries !== "no"
          ? this.renderGroupedBar()
          : this.state.isLoading == false
          ? this.props.isStack
            ? this.renderStackedBar()
            : this.renderBar()
          : null}
      </Fragment>
    );
  }
}

export default BarChartComp;
