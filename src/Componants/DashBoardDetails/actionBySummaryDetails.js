import React, { Component } from "react";
import Api from "../../api";

class ActionBySummaryDetails extends Component {
  state = { action: null };
  
  componentDidMount() {

    const query = new URLSearchParams(this.props.location.search);
 
    let action =null;

    for (let param of query.entries()) { 
      action= param[1] 
    } 

    Api.get("GetActionsBySummaryDetails?action="+action).then(result => {
       console.log(result);
      });
  }

  render() {
       

    return (
      <div>
        <p>this is ActionBySummaryDetails</p>
        <span>{this.state.action}</span>
      </div>
    );
  }
}

export default ActionBySummaryDetails;
