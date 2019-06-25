import React, { Component } from 'react'
import ModernDatepicker from 'react-modern-datepicker';
import Resources from '../../resources.json';
import moment from "moment";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
class DatePicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Date: this.props.startDate,
        }
    }

    handleChange() {
        this.props.handleChange();
    }

    componentWillReceiveProps = (nextprops) => {
        if (nextprops.startDate) {
            this.setState({
                Date: nextprops.startDate === null ? moment().format('YYYY-MM-DD') : moment(nextprops.startDate).format('YYYY-MM-DD')
            })
        }
    }

    render() {
        return (
            <div className="customDatepicker fillter-status fillter-item-c ">
                <div className="proForm datepickerContainer">
                    <label className="control-label">{this.props.title ? Resources[this.props.title][currentLanguage] : ""}</label>
                    <div className="linebylineInput" >
                        <div className="inputDev ui input input-group date NormalInputDate">
                            <ModernDatepicker
                                date={this.state.Date}
                                format={'YYYY-MM-DD'}
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