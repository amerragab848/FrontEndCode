import React, { Component } from "react";
import Api from "../../api";

class OpenedSummaryDetails extends Component {
  state = { action: null };

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    const queryes = this.props.location.search;

    let action = null;

    for (let param of query.entries()) {
      action = param[1];
    }

    if (action) {
      Api.get("SelectDocTypeByProjectIdOpenedByAction?action=" + action+"&pageNumber="+0).then(
        result => {
          console.log(result);
        }
      );
    }
  }

  render() {
    return (
      <div>
        <p>this is OpenedSummaryDetails</p>
        <span>{this.state.action}</span>
      </div>
    );
  }
}

export default OpenedSummaryDetails;
