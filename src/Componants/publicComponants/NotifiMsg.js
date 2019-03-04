import React, { Component } from "react";
import Resources from "../../resources.json";
let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

 export default class NotifiMsg extends Component {
    constructor(props) {
      super(props);
      
      this.state = { 
        statusClass: "disNone",
        animationBlock: "animationBlock"
      }

    }
    
    componentWillReceiveProps(nextProps, prevProps) {
      if (nextProps.showNotify != nextProps.showNotify) {
        this.setState({
          animationBlock: "disNone"
      });
      }
  };

    render() {
       
      return (
          <div className={this.props.showNotify === true ? this.state.animationBlock : this.state.statusClass}>
        <div className={this.props.IsSuccess === true ? "notfiSuccess notifiActionsContainer" : "notifiError notifiActionsContainer" }>
            <span className="notfiSpan">{this.props.Msg}</span> 
        </div> 
        </div>
      )   
    }
}