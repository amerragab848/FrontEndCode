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

  onOpenModal = function() {
    if (this.props.isModal) {
      this.setState({ open: true });
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

      var high = widgetes.find(function(i) {
        return i.action == 1;
      });

      var normal = widgetes.find(function(i) {
        return i.action == 2;
      });

      var low = widgetes.find(function(i) {
        return i.action == 3;
      });

      return (
        <div className="summerisItem">
          <div className="content">
            <h4 className="title">{this.props.title}</h4>
            <p className="number">{high ? high[this.props.value] : 0}</p>
            <p className="status">{high ? high[this.props.text] : ""}</p>
            <ul className="satusBarUL">
              <li className="num-1" />
              <li className="num-2" />
              <li className="num-3" />
            </ul>
            <div className="summerisList">
              <div className="first">
                <span>{normal ? normal[this.props.value] : 0} </span>{" "}
                {normal ? normal[this.props.text] : ""}
              </div>
              <div>
                <span>{low ? low[this.props.value] : ""} </span>{" "}
                {low ? low[this.props.text] : ""}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <div>{this.drawThreeCard()}</div>
        <Modales
          opened={this.state.open}
          closed={this.onCloseModal}
          id={this.props.id}
          key={this.props.id}
        />
      </div>
    );
  }
}

export default ApprovedWidget;
