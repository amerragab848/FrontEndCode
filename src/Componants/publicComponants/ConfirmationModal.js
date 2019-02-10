import React, { Component } from "react";
import Rodal from "../../Styles/js/rodal";
import "../../Styles/css/rodal.css";
import '../../Styles/scss/en-us/layout.css'
import Resources from "../../resources.json";
let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class ConfirmationModal extends Component {
  
    constructor(props) {
    super(props); 
  }

  clickHandlerCancel = e => {
    this.props.clickHandlerCancel();
  };

  clickHandlerContinue = e => {
    this.props.clickHandlerContinue();
  };

  closeModal = e =>{
    this.props.closed();
  }

  render() {
    return (
      <div>
        <Rodal visible={true} onClose={this.closeModal}>
          <div className="ui modal smallModal" id="smallModal">
            <div className="header zero">
              {this.props.title} 
            </div>
            <div className="actions">
              <button className="defaultBtn btn cancel smallBtn" onClick={this.clickHandlerCancel}>
                {Resources["cancel"][currentLanguage]} 
              </button>

              <button className="smallBtn primaryBtn-1 btn approve" onClick={this.clickHandlerContinue}>
                {this.props != null ?Resources[this.props.buttonName][currentLanguage]:Resources["goEdit"][currentLanguage]}
              </button>
            </div>
          </div>
        </Rodal>
      </div>
    );
  }
}

export default ConfirmationModal;
