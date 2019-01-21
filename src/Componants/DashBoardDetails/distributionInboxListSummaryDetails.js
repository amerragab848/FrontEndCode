import React, { Component } from "react";
import Api from "../../api";

class DistributionInboxListSummaryDetails extends Component {
  state = { action: null };

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);

    let action = null;
    let id = null;

    let index = 0;
    for (let param of query.entries()) {
      index === 0 ? (id = param[1]) : (action = param[1]);
      index++;
    }

    if (id === "0") {
      if (action) {
        Api.get(
          "GetDocApprovalDetailsInbox?action=" +action).then(result => {
          console.log(result);
        });
      }
    }else {
      if (action) {
        Api.get(
          "GetDocApprovalDetailsDistriburtionList?action=" +
            action +
            "&pageNumber=" + 0 +"&pageSize="+200
        ).then(result => {
          console.log(result);
        });
      }
    }
  }

  render() {
    return (
      <div>
        <p> this is distributionInboxListSummaryDetails</p>
        <span>{this.state.action}</span>
      </div>
    );
  }
}

export default DistributionInboxListSummaryDetails;
