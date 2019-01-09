import React, { Component } from "react";
import "../../Styles/scss/en-us/dashboard.css";
import Modales from "./modal";
import Api from "../../api";

class ApprovedWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      dataList: []
    };
  }

  componentDidMount() {
    Api.get(this.props.api).then(result => {
      this.setState({
        dataList: result
      });
    });
  }

  onOpenModal = function(i) {
    if (this.props.isModal) {
      this.setState({ open: true });
    } else {
    }
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  drawThreeCard() {
    let widgetes = [];
    console.log(this.state.dataList);
    if (this.state.dataList.length > 0) {
      widgetes = this.state.dataList;
    }

    let drawWidget = widgetes.map((i, index) => {
      return (
        <div
          onClick={() => this.onOpenModal(i)}
          className="counter_inner_container"
          style={{ cursor: "pointer" }}
          key={index + "-div"}
        >
          <p
            style={{
              display: "inline-block"
            }}
            className="card-text"
          >
            {i[this.props.text]}
          </p>
          &nbsp;&nbsp;
          <span>{i[this.props.value]}</span>
        </div>
      );
    });

    return drawWidget;
  }

  render() {
    return (
      <div className="SummeriesContainer ">
        <div className="SummeriesContainerContent">
          <div className="card-body">
            <h5 className="card-title">{this.props.title}</h5>
            <div>{this.drawThreeCard()}</div>
            <Modales
              opened={this.state.open}
              closed={this.onCloseModal}
              id={this.props.id}
              key={this.props.id}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ApprovedWidget;
