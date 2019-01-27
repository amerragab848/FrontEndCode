import React, { Component } from "react";
import Api from "../../api";

class PendingExpensesDetails extends Component {
 

  componentDidMount() {
     
    Api.get("GetExpensesWorkFlowTransactionByContactId").then(result => {
      console.log(result);
    });
  }

  render() {
    return (
      <div>
        <p> this is PendingExpensesDetails</p> 
      </div>
    );
  }
}

export default PendingExpensesDetails;
