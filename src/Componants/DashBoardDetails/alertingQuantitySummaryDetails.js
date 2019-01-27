import React, { Component } from "react";
import Api from "../../api";

class AlertingQuantitySummaryDetails extends Component {
  state = { action: null };

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);

    let action = null;

    for (let param of query.entries()) {
      action = param[1];
    }

    Api.get(
      "GetBoqQuantityRequestedAlertDetails?action=" +
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
        <p>this is AlertingQuantitySummaryDetails</p>
        <span>{this.state.action}</span>
      </div>
    );
  }
}

export default AlertingQuantitySummaryDetails;
