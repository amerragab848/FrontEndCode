import React, { Component } from 'react'
import Select from 'react-select';
import Resources from '../../resources.json';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class DropdownMelcous extends Component {
    constructor(props) {
        super(props) 
       
    }
   
    handleChange =(e)=>{
        this.props.handleChange(e,'sokary')
    }

    handleBlur = (e) => { 
        this.props.handleBlur(this.props.name, true);
    }

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
                    <div className="customD_Menu" style={{ outline: "none" }}>
                        <Select key={this.props.index} ref={this.props.index}
                             
                            options={this.props.data}
                            placeholder={this.props.title ? Resources[this.props.title][currentLanguage] : ""}
                            isSearchable="true"
                            defaultValue= {this.props.isMulti ? this.props.selectedValue : this.props.value}
                            value={ this.props.isMulti ? this.props.value : this.props.selectedValue}
                            isMulti={this.props.isMulti}
                            onBlur={this.props.onblur}
                            isClearable={this.props.isClear? true : false }
        

                            name={this.props.name ? this.props.index: this.props.name} 
                            id={this.props.id ? this.props.index: this.props.id} 
                            onChange={this.props.handleChange}
                            onBlur={this.props.handleBlur}
                        />
                          
                    </div>
                </div>
            </div>
        )
    }
}

export default DropdownMelcous;