import React, { Component } from 'react'
import Select from 'react-select';
import Resources from '../../resources.json';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');


const ProjectStyles = {
    
    option: (styles, { isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            backgroundColor: isDisabled
                ? '#fff'
                : isSelected ? '#e9ecf0' : isFocused ? '#f2f6fa' : "#fff",
            color: '#3e4352',
            fontSize: '14px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            textTransform: 'capitalize',
            fontFamily: 'font-opens',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        };
    },
};


class DropdownMelcous extends Component {
    constructor(props) {
        super(props)

    }


    handleChange = value => {

        if (this.props.onChange != undefined) {
            this.props.onChange(this.props.name, value);

        }
        this.props.handleChange(value, this.props.name);
    };


    handleBlur = () => {
        if (this.props.onBlur != undefined)
            this.props.onBlur(this.props.name, true);

    };

    render() {

        return (
            <div className={"fillter-status fillter-item-c " + this.props.className} key={this.props.index}>
                <div className="spanValidation">
                    <label className="control-label">{this.props.title ? Resources[this.props.title][currentLanguage] : ""}</label>
                    {
                        this.props.message ?
                            <span>{this.props.message}</span> : ""
                    }
                </div>
                <div>
                    <div className={"customD_Menu " + (this.props.error ? "errorClass" : '')} style={{ outline: "none", position: 'relative' }}>

                        <div>

                            <Select key={this.props.index} ref={this.props.index}

                                options={this.props.data}
                                placeholder={this.props.title ? Resources[this.props.title][currentLanguage] : ""}
                                isSearchable="true"
                                defaultValue={this.props.isMulti ? this.props.selectedValue : this.props.value}
                                value={this.props.isMulti ? this.props.value : this.props.selectedValue}
                                isMulti={this.props.isMulti}
                                isClearable={this.props.isClear ? true : false}
                                name={this.props.name ? this.props.index : this.props.name}
                                id={this.props.id ? this.props.index : this.props.id}
                                onChange={this.handleChange}
                                onBlur={this.handleBlur}
                                styles={ProjectStyles}
                            />
                            {this.props.error && this.props.touched && (
                                <em className="dropdown__error">
                                    {this.props.error}
                                </em>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DropdownMelcous;