import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import Resources from "../../resources.json";
import Api from "../../api";

import Modal from "react-responsive-modal";

var hoverPointer = {
  cursor: "Pointer"
};

let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

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
      this.setState({
        value: result != null ? result : 0
      });
    });
  }

  onOpenModal = () => {
    if(this.state.value > 0){
      this.props.history.push({
        pathname: this.props.props.route,
        search: "?key=" + this.props.props.key
      });
    }
  };
 

  render() { 
    return (
      <Fragment>
        <div className="summerisItem">
          <div className="content">
            <h4 className="title">
              {Resources[this.props.title][currentLanguage]}
            </h4>
            <p className="number"  onClick={this.onOpenModal.bind(this)}>
              {this.state.value}
            </p>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Widgets);
