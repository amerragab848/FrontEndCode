import React, { Component } from "react";
  
 export default class NotifiMsg extends Component {
    constructor(props) {
      super(props);
      
      this.state = { 
        statusClass: "disNone",
        animationBlock: "animationBlock",
        showNotify: false
      }

    }
    
    componentWillReceiveProps(nextProps, prevProps) {
      if (prevProps.showNotify != nextProps.showNotify) {
        this.setState({
          animationBlock: "animationBlock",
          showNotify: nextProps.showNotify
        });
        
        if(nextProps.showNotify === true)
        {
          setTimeout(() => {
            this.setState({
              showNotify: false,
              statusClass: "disNone",
            });
          }, 3000); 
        }
        
      }
  };

    render() {
       
      return (
          <div className={this.state.showNotify === true ? this.state.animationBlock : this.state.statusClass}>
        <div className={this.props.IsSuccess === true ? "notfiSuccess notifiActionsContainer" : "notifiError notifiActionsContainer" }>
            <span className="notfiSpan">{this.props.Msg}</span> 
        </div> 
        </div>
      )   
    }
}