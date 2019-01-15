import React from 'react'
import ModernDatepicker from 'react-modern-datepicker';
function DatePicker(props) {

    return (
        <div className="customDatepicker fillter-status fillter-item-c ">
            <form className="proForm datepickerContainer">
                <div className="linebylineInput">
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
            </form>
        </div>


    )
}

export default DatePicker;