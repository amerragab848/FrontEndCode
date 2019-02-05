import React, { Component } from "react";
import Resources from "../../resources.json";
let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

 export default class NotifiMsg extends Component {
    constructor(props) {
      super(props);

    }

    render() {
       
      return (
          <div className={this.props.statusClass}>
        <div className={this.props.IsSuccess === "true" ? "notfiSuccess notifiActionsContainer" : "notifiError notifiActionsContainer" }>
            <span className="notfiSpan">{this.props.Msg}</span>
            {/* <a href="" className="notifiActionBtn">DISMISS</a> */}
        </div> 
        </div>
      )   
    }
}