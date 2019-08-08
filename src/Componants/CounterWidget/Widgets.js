import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import Resources from "../../resources.json";
import Api from "../../api";

import numeral from 'numeral'
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class Widgets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      open: false,
      detailsData: []
    };
  }

  componentDidMount() {

    Api.get(this.props.props.api).then(result => {
      if (result) {
        this.setState({
          value: result != null ? result : 0
        });
      }
    });
  }

  onOpenModal = () => {
    if (this.state.value > 0) {
      let arr = this.props.props.route.split('action');
      if (arr.length > 1) {
        this.props.history.push(
          this.props.props.route
        );
      }
      else {
        this.props.history.push({
          pathname: this.props.props.route,
          search: "?key=" + this.props.props.key
        });
      }
    }
  };


  render() {
    return (
      <Fragment>
        <div className="summerisItem__number">
          <div className="content__number">
            <p className="number" onClick={this.onOpenModal.bind(this)}>
              {this.state.value != null ? numeral(this.state.value).format('0a') : 0}
            </p>
            <h4 className="title">
              {Resources[this.props.title][currentLanguage]}
            </h4>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Widgets);
