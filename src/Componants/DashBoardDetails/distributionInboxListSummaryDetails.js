import React, { Component } from "react";
import Api from "../../api";
import queryString from "query-string";

class DistributionInboxListSummaryDetails extends Component {
  componentDidMount() {
    //  const query = new URLSearchParams(this.props.location.search);

    const query = queryString.parse(this.props.location.search);

    let id = query["id"];
    let action = query["action"];
    
    if (id === "0") {
      if (action) {
        Api.get("GetDocApprovalDetailsInbox?action=" + action).then(result => {
          console.log(result);
        });
      }
    } else {
      if (action) {
        Api.get(
          "GetDocApprovalDetailsDistriburtionList?action=" +
            action +
            "&pageNumber=" +
            0 +
            "&pageSize=" +
            200
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
      </div>
    );
  }
}

export default DistributionInboxListSummaryDetails;
