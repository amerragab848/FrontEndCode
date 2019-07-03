import React, { Component } from "react";
import Resources from "../../resources.json";
let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class InputMelcous extends Component {
  constructor(props) {
    super(props); 
  }
  render() {
    return (
      <div className={ this.props.fullwidth == "true" ? "letterFullWidth fullInputWidth linebylineInput" : "fillter-status fillter-item-c"}>
        <label className="control-label">
          {Resources[this.props.title][currentLanguage]}
        </label>
        <div className="inputDev ui input">
          <input
            type={this.props.type === undefined ? "text" : this.props.type}
            className="form-control"
            id="lastname1"
            placeholder={
              this.props.placeholderText == null
                ? " "
                : Resources[this.props.placeholderText][currentLanguage]
            }
            fullwidth={this.props.fullwidth}
            value={this.props.value}
            name={this.props.name}
            defaultValue={this.props.defaultValue}
            onChange={this.props.inputChangeHandler}
            onBlur={this.props.onBlurEvent}
          />
        </div>
      </div>
    );
  }
}
export default InputMelcous;
