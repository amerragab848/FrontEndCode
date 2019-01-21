import React, { Component } from "react";
import Api from "../../api";

class ClosedSummaryDetails extends Component {
  state = { action: null };

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);

    let action = null;

    for (let param of query.entries()) {
      action = param[1];
    }

    Api.get(
        "SelectDocTypeByProjectIdClosedByAction?action=" +
        action +
        "&pageNumber=" +
        0
    ).then(result => {
      console.log(result);
    });
  }

  render() {
    return (
      <div>
        <p> this is closedSummaryDetails</p>
        <span>{this.state.action}</span>
      </div>
    );
  }
}

export default ClosedSummaryDetails;
