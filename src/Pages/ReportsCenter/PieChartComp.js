import React, { Component } from "react"; 
import { Donut, Legend, ResponsiveContainer, withResponsiveness } from "britecharts-react";
import Api from "../../api";
import language from "../../resources.json";
let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
 

const colorSchema = [
  "#07bc0c",
  "#119015",
  "#47cc4a",
  "#7cdb79",
  "#5fd45f",
  "#119015",
  "#07bc0cbb"
];

let data = {};

class PieChartComp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataChart: [],
      isLoading: true,
      data: {},
      isAnimated: true,
      showLegend: false,
      highlightedSlice: null,
      noClicks: null
    };
  }

  componentWillReceiveProps(props) {
    let dataChart = [];
    if (props.series.length > 0) {
      props.series[0].data.map((item, index) => {
        dataChart.push({
          quantity: item["y"],
          name: item["name"],
          id: index
        });
        return null;
      });

      this.setState({ isLoading: false, dataChart: dataChart });
    }
  }

  logMouseOver = e => {
    this.setState({
      data: e.data,
      highlightedSlice: e.data.id,
      showLegend: true
    });
  };

  render() {
    return (
      <div className="panel">
        <div className="panel-body">
          <h2>{this.props.title}</h2>
          <ResponsiveContainer
            render={({ width }) => (
              <div className="donut__legend">
                <Donut
                  data={this.state.dataChart}
                  height={width / 2}
                  width={width / 2}
                  externalRadius={width / 4}
                  internalRadius={width / 10}
                  colorSchema={colorSchema}
                  customMouseOver={this.logMouseOver}
                  highlightSliceById={this.state.highlightedSlice}
                  isAnimated={false}
                />

                {this.state.showLegend === true ? (
                  <p id="legenbd__teext">
                    <span className="chartName"> {this.state.data.name}</span>
                    <span className="percentage">
                      {this.state.data.percentage + "%"}
                    </span>
                    <span className="totalAmount">
                      {this.state.data.quantity + "LE"}
                    </span>
                  </p>
                ) : null}
              </div>
            )}
          />
        </div>
      </div>
    );
  }
}

export default PieChartComp;
