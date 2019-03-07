import React, { Component,Fragment } from "react";
import { withRouter } from "react-router-dom";
import Modales from "./modal";
import Api from "../../api";
import "../../Styles/css/rodal.css";
import language from "../../resources.json"; 

let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class ApprovedWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      dataList: [],
      action: 0
    };
  }

  componentDidMount() {
    Api.get(this.props.props.api).then(result => {
      
      this.setState({
        dataList: result
      });
    });
  }

  onOpenModal = (action, value) => {
    if (value > 0) {  

      let splitestring = this.props.props.route.split("?");

      if(splitestring){
        this.props.history.push(this.props.props.route + action);
      }else{
        this.props.history.push(this.props.props.route);  
      } 
    }
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  drawThreeCard() {
    let widgetes = [];

    if (this.state.dataList.length > 0) {
      widgetes = this.state.dataList;

      var high = widgetes.find(function(i) {
        return i.action === 1;
      });

      var normal = widgetes.find(function(i) {
        return i.action === 2;
      });

      var low = widgetes.find(function(i) {
        return i.action === 3;
      });
  
      return (
        <div className="summerisItem">
          <div className="content">
            <h4 className="title">{this.props.title}</h4>
            <p className="number" onClick={() => this.onOpenModal(high.action, high[this.props.props.value])}>
              {high ? high[this.props.props.value] : 0}
            </p>
            <p className="status">
              {high ? language[high[this.props.props.listType]][currentLanguage] : ""}
            </p>
            <ul className="satusBarUL">
              <li className="num-1" />
              <li className="num-2" />
              <li className="num-3" />
            </ul>
            <div className="summerisList">
              <div className="first">
                <span
                  className="mediumModal"
                  onClick={() => this.onOpenModal(normal.action, normal[this.props.props.value]) } >
                  {normal ? normal[this.props.props.value] : 0} 
                </span>
                {normal ? " "+language[normal[this.props.props.listType]][currentLanguage]: ""}
              </div>
              <div>
                <span className="mediumModal" onClick={() => this.onOpenModal(low.action, low[this.props.props.value])}>
                  {low ? low[this.props.props.value] : ""}
                </span>
                {low ? " "+language[low[this.props.props.listType]][currentLanguage] : ""}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <Fragment>
       {this.drawThreeCard()} 
      </Fragment>
    );
  }
}

export default withRouter(ApprovedWidget);
