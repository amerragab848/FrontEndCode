import React, { Component } from 'react'
import Select from 'react-select';
import Resources from '../../resources.json';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class DropdownMelcous extends Component {
    constructor(props) {
        super(props);

        // this.state = {
        //     selectedValue:this.props.selectedValue,
        //     isloading: false
        // };
    }
   
    handleChange =(e) => { 
        this.props.handleChange(e)
    }

    // componentWillReceiveProps(nextProps,prevProps) {
    //   if (nextProps.selectedValue !== prevProps.selectedValue) { 
    //     this.setState({selectedValue: nextProps.selectedValue})
    //   } 
    // }

    // shouldComponentUpdate(prevProps, prevState) {
    //     if (this.props.selectedValue !== prevProps.selectedValue) {
    //          this.setState({isloading: true})
    //          return true;
    //      }else{
    //         return false;
    //      } 
    // }

    // componentDidUpdate(prevProps, prevState) {
    //     if (this.props.selectedValue.value !== prevProps.selectedValue.value) {
    //          this.setState({selectedValue: this.props.selectedValue})
    //          this.setState({isloading: false})
    //          console.log('componentDidUpdate',this.props.selectedValue,prevProps.selectedValue,this.state.selectedValue);
    //      } 
    // }

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
                                name="form-field-name" 
                                onChange={this.props.handleChange}
                                options={this.props.data}
                                placeholder={this.props.title ? Resources[this.props.title][currentLanguage] : ""}
                                isSearchable="true"
                                defaultValue={this.props.selectedValue}
                                 value={this.props.selectedValue}
                                //onOptionSelected={this.props.selectedValue}
                                isMulti={this.props.isMulti}
                                onBlur={this.props.onblur}
                               //isClearable={true}
                            />
                        </div>
                      
                    </div>
                </div> 
             )
    }

}

export default DropdownMelcous;