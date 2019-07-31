import React, { Component, Fragment } from 'react'
import Select, { components } from 'react-select';
import Resources from '../../resources.json';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

let publicFonts = currentLanguage === "ar" ? 'cairo-sb' : 'Muli, sans-serif'

const publicStyles = {
    control: (styles, { isFocused }) =>
        ({
            ...styles,
            backgroundColor: '#fff',
            width: '100%',
            height: '48px',
            borderRadius: '4px',
            border: isFocused ? "solid 2px #83B4FC" : '2px solid #E9ECF0',
            boxShadow: 'none',
            transition: ' all 0.4s ease-in-out'
        }),
    option: (styles, { isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            backgroundColor: isDisabled ? '#fff' : isSelected ? '#e9ecf0' : isFocused ? '#f2f6fa' : "#fff",
            color: '#3e4352',
            fontSize: '14px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            textTransform: 'capitalize',
            fontFamily: publicFonts,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            zIndex: '155'
        };
    },
    input: styles => ({ ...styles, maxWidth: '100%' }),
    placeholder: styles => ({ ...styles, color: '#A8B0BF', fontSize: '13px', width: '100%', fontFamily: publicFonts }),
    singleValue: styles => ({ ...styles, color: '#252833', fontSize: '13px', width: '100%', fontFamily: publicFonts }),
    indicatorSeparator: styles => ({ ...styles, display: 'none' }),
    menu: styles => ({ ...styles, zIndex: 155, boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.2)', border: 'solid 1px #ccd2db' })
};



const ArrowPublic = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" xmlnsXlink="http://www.w3.org/1999/xlink">
            <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Icons/Info/drop/defaultBtn/16px/Black" fill="#5E6475">
                    <g id="info_24pt-black">
                        <path fill="#5E6475" fillRule="evenodd" d="M11.319 6c.886 0 .8.687.346 1.235-.587.705-2.28 2.757-2.728 3.224-.69.721-1.004.722-1.696 0L4.303 7.235C3.866 6.719 3.848 6 4.606 6h6.713z"></path>
                    </g>
                </g>
            </g>
        </svg>
    );
};

const DropdownIndicator = props => {
    return (
        <Fragment>
            <components.DropdownIndicator {...props}>
                <ArrowPublic />
            </components.DropdownIndicator>
        </Fragment>
    );
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
            <div className={"fillter-status fillter-item-c new_height " + this.props.className} key={this.props.index}>
                <div className="spanValidation">
                    <label className="control-label">{this.props.title ? Resources[this.props.title][currentLanguage] : ""}</label>
                    {
                        this.props.message ?
                            <span>{this.props.message}</span> : ""
                    }
                </div>
                <Fragment>
                    <div className={"customD_Menu " + (this.props.error && this.props.touched ? " errorClass" : '')} style={{ outline: "none", position: 'relative' }}>
                        <div>
                            <Select key={this.props.index} ref={this.props.index}
                                isDisabled={this.props.isDisabled == true ? true : false}
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
                                closeMenuOnSelect={this.props.closeMenuOnSelect !== undefined ? this.props.closeMenuOnSelect : true}
                                components={{ DropdownIndicator }}
                                className={this.props.classDrop + (this.props.error && this.props.touched ? " drop__hasError" : " ")}
                                styles={this.props.styles ? this.props.styles : publicStyles} />
                            {this.props.touched && (<em className="dropdown__error">{this.props.error}</em>)}
                        </div>
                    </div>
                </Fragment>
            </div>
        )
    }
}

export default DropdownMelcous;