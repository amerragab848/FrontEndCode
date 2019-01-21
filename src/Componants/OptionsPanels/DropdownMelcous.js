import React, { Component } from 'react'
import Select from 'react-select';
  
class DropdownMelcous extends Component { 
    constructor(props) {
        super(props) 
    }

    componentDidUpdate(prevProps) { 
        if (this.props.selectedValue !== prevProps.selectedValue) {  
        }
    } 
 
      componentWillReceiveProps(nextProps, nextState){ 
            if(this.props.selectedValue){  
            }
     }

     render() {
        return (
            <div className={"fillter-status fillter-item-c " + (this.props.className ? (this.props.className) : "")}  key={this.props.index}>
                <div className="spanValidation">
                    <label className="control-label">{this.props.title}</label>
                    {
                        this.props.message  ?
                            <span>{this.props.message}</span> : ""
                    } 
                </div>
                <div className="ui fluid selection dropdown singleDropDown" >
                    <div className="customD_Menu" style={{ outline: "none" }}>
                        <Select    
                            value={this.props.selectedValue}
                            onChange={this.props.handleChange}
                            options={this.props.data}
                            placeholder={this.props.placeholder===null?'Select ...':this.props.placeholder}
                            isSearchable="true"
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