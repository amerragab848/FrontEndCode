import React, { Component } from "react";
import Api from "../../api";

class DocNotifyLogDetails extends Component {

  componentDidMount() { 

      Api.get("GetNotifyRequestsDocApprove").then(
        result => {
          console.log(result);
        }
      ); 
  }

  render() {
    return (
      <div>
        <p>this is docNotifyLogDetails</p> 
      </div>
    );
  }
}

export default DocNotifyLogDetails;
