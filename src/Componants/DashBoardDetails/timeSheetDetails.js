import React, { Component } from "react";
import Api from "../../api";

class TimeSheetDetails extends Component {

  componentDidMount() { 
      Api.get("GetApprovalRequestsGroupByUserId?requestType=timeSheet").then(
        result => {
          console.log(result);
        }
      ); 
  }

  render() {
    return (
      <div>
        <p>this is TimeSheetDetails</p> 
      </div>
    );
  }
}

export default TimeSheetDetails;
