import React from 'react'
import ModernDatepicker from 'react-modern-datepicker';
function DatePicker(props) {

    return (
        <div className="customDatepicker fillter-status fillter-item-c "> 
            <div className="proForm datepickerContainer"> 
            <label className="control-label">{props.title}</label>
                <div className="linebylineInput" >
                    <div className="inputDev ui input input-group date NormalInputDate">
                        <ModernDatepicker
                            date={props.startDate}
                            format={'DD-MM-YYYY'}
                            showBorder
                            onChange={(date) => props.handleChange(date)}
                            placeholder={'Select a date'}
                        />
                    </div>
                </div>
            </div>
        </div>


    )
}

export default DatePicker;