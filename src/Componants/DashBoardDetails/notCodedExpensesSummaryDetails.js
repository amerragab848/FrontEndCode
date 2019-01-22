import React, { Component } from "react";
import Api from "../../api";

class NotCodedExpensesSummaryDetails extends Component {

  componentDidMount() {

    console.log("componentDidMount");

    const query = new URLSearchParams(this.props.location.search);

    let action = null;

    for (let param of query.entries()) {
      action = param[1];
    }

    if (action) {
      Api.get("GetNotCodedExpensesSummaryDetail?action=" + action).then(
        result => {
          console.log(result);
        }
      );
    }
  }

  render() {

    console.log("render");

    return (
      <div>
        <p>this is NotCodedExpensesSummaryDetails</p> 
      </div>
    );
  }
}

export default NotCodedExpensesSummaryDetails;
