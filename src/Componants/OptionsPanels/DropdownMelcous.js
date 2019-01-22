import React, { Component } from 'react'
import Select from 'react-select';
import Resources from '../../resources.json';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class DropdownMelcous extends Component {
    constructor(props) {
        super(props)

    }

    render() {

        return (
            <div className={"fillter-status fillter-item-c " + (this.props.className ? (this.props.className) : "")} key={this.props.index}>
                <div className="spanValidation">
                    <label className="control-label">{this.props.title? Resources[this.props.title][currentLanguage] : ""}</label>
                    {
                        this.props.message ?
                            <span>{this.props.message}</span> : ""
                    }
                </div>
                <div className="ui fluid selection dropdown singleDropDown" >
                    <div className="customD_Menu" style={{ outline: "none" }}>
                        <Select key={this.props.index} ref={this.props.index}
                            name="form-field-name"
                              value={this.props.selectedValue}
                          //  valueKey={this.props.index}
                            onChange={this.props.handleChange}
                            options={this.props.data}
                            placeholder={this.props.placeholder===null?'Select ...': Resources[this.props.placeholder][currentLanguage]}
                            isSearchable="true"
                            defaultValue={this.props.selectedValue}
                            isMulti={this.props.isMulti}
                            onBlur={this.props.onblur}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default DropdownMelcous;