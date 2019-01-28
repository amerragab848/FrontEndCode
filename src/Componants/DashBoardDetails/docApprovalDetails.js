import React, { Component } from "react";
import Api from "../../api";

class DocApprovalDetails extends Component {
  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);

    let action = null;

    for (let param of query.entries()) {
      action = param[1];
    }
    if (action === 1) {
      Api.get("GetRejectedRequestsDocApprove").then(result => {
        console.log(result);
      });
    }else{
      Api.get("GetApprovalRequestsDocApprove").then(result => {
        console.log(result);
      });
    }
  }

  render() {
    return (
      <div>
        <p> this is DocApprovalDetails</p>
      </div>
    );
  }
}

export default DocApprovalDetails;
