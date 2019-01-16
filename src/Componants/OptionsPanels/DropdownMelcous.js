import React from 'react'
import Select from 'react-select';
 
function DropdownMelcous(props) {
    return (
        <div className={"fillter-status fillter-item-c " + (props.className ? (props.className) : "")}>
            <div className="spanValidation">
                <label className="control-label">{props.title}</label>
                {
                    props.message  ?
                        <span>{props.message}</span> : ""
                }
            </div>
            <div className="ui fluid selection dropdown singleDropDown" >
                <div className="customD_Menu" style={{ outline: "none" }}>
                    <Select 
                        onChange={props.handleChange} options={props.data}
                        placeholder={props.placeholder===null?'Select ...':props.placeholder}
                        isSearchable="true" isMulti={props.isMulti}
                        onBlur={props.onblur} defaultValue={props.data[3]}
                    /> 
                </div>
            </div>
        </div>
    )
}

export default DropdownMelcous;