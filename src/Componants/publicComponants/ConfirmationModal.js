import React, { Component } from "react";

// import "../../Styles/css/rodal.css";
import Resources from "../../resources.json";
import SkyLight from "react-skylight";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

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

  closeModal = e => {
    
    this.props.closed();
  }

  componentDidMount() {
    this.simpleDialog.show();
    
  }

  componentWillReceiveProps() {
    this.simpleDialog.show();
  }

  render() {
    return (
      <div>
        <SkyLight ref={ref => (this.simpleDialog = ref)}>
          <div className="ui modal smallModal ConfirmationModal" id="smallModal">
            <div className="header zero">
              {this.props.title}
            </div>
            <div className="actions">
              <button className="defaultBtn btn cancel smallBtn" type="button" onClick={this.clickHandlerCancel}>
                {this.props.cancel ? Resources[this.props.cancel][currentLanguage] : Resources["cancel"][currentLanguage]}
              </button>

              <button className="smallBtn primaryBtn-1 btn approve" type="button" onClick={this.clickHandlerContinue}>
                {this.props != null ? Resources[this.props.buttonName][currentLanguage] : Resources["goEdit"][currentLanguage]}
              </button>
            </div>
          </div>
        </SkyLight>
      </div>
    );
  }
}

export default ConfirmationModal;
