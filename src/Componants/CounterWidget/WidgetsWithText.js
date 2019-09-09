import React, { Component, Fragment } from "react";
import Resources from "../../resources.json";
import Api from "../../api";
import { withRouter } from "react-router-dom";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class WidgetsWithText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      total: 0,
      open: false,
      detailsData: []
    };
  }

  componentDidMount() {
    Api.get(this.props.props.api).then(data => {
      if (data) {
        let _value = this.props.props.value.split("-");
        let _total = this.props.props.total.split("-");

        this.setState({
          count: data[_value[1]][_value[0]] != null ? data[_value[1]][_value[0]] : 0,
          total: data[_total[1]][_total[0]] != null ? data[_total[1]][_total[0]] : 0
        });
      }
    });
  }

  onOpenModal() {
    if (this.props.props.route != "") {
      if (this.state.count > 0) {
        this.props.history.push({
          pathname: this.props.props.route,
          search: "?key=" + this.props.props.key
        });
      }
    }
  }

  render() {
    return (
      <Fragment>
        <div className="summerisItem withOutOf">
          <div className="content">
            <h4 className="title">
              {Resources[this.props.title][currentLanguage]}
            </h4>
            <p className="number" onClick={this.onOpenModal.bind(this)}>
              {this.state.count}
              <sub>Out Of {this.state.total}</sub>
            </p>
          </div>
        </div>
        <div />
      </Fragment>
    );
  }
}
export default withRouter(WidgetsWithText);
