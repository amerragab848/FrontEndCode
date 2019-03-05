import React, { Component } from 'react'
import ModernDatepicker from 'react-modern-datepicker';
import Resources from '../../resources.json';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
class DatePicker extends Component {

//function DatePicker() {
   constructor(props) {
        super(props); 
        //this.handleChange=this.handleChange.bind(this);
    }

    handleChange ()  { 
        this.props.handleChange();
    }

    render() {  
            return (
                <div className="customDatepicker fillter-status fillter-item-c "> 
                    <div className="proForm datepickerContainer"> 
                    <label className="control-label">{this.props.title ? Resources[this.props.title][currentLanguage] : ""}</label>
                        <div className="linebylineInput" >
                            <div className="inputDev ui input input-group date NormalInputDate">
                                <ModernDatepicker
                                    date={this.props.startDate}
                                    format={'DD-MM-YYYY'}
                                    showBorder
                                    onChange={this.props.handleChange}
                                    placeholder={'Select a date'}
                                />
                            </div>
                        </div>
                    </div>
                </div> 
            )
    }
}

export default DatePicker;