import React, { Component } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import GridCustom from 'react-customized-grid';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import moment from "moment";
import ExportDetails from "../ExportReportCenterDetails";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class UserWithOutTimeSheet extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            rows: [],
            startDate: moment()
        }

        if (!Config.IsAllow(3712)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

        this.columns = [{
            "field": "code",
            "title": Resources.refNo[currentLanguage],
            "type": "text",
            "width": 15,
            "fixed": true,
            "groupable": true,
            "sortable": true
        }, {
            "field": "contactName",
            "title": Resources.ContactName[currentLanguage],
            "type": "text",
            "width": 25,
            "fixed": true,
            "groupable": true,
            "sortable": true
        }, {
            "field": "companyName",
            "title": Resources.CompanyName[currentLanguage],
            "type": "text",
            "width": 25,
            "fixed": true,
            "groupable": true,
            "sortable": true
        }];

        this.fields = [{
            title: Resources["startDate"][currentLanguage],
            value: this.state.startDate,
            type: "D"
        }];
    }


    getGridRows = () => {
        this.setState({ isLoading: true })
        let obj = {
            pageNumber: 0,
            pageSize: 200,
            startDate: moment(this.state.startDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
        }
        Api.post('GetUsersWithOutTimeSheet', obj).then((res) => {
            this.setState({
                rows: res, isLoading: false
            });
        }).catch(() => {
            this.setState({ isLoading: false, rows: [] })
        })
    }

    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }

    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridCustom ref='custom-data-grid' groups={[]} data={this.state.rows || []} cells={this.columns}
                pageSize={this.state.rows.length} actions={[]} rowActions={[]} rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = <ExportDetails fieldsItems={this.columns}
            rows={this.state.rows} fields={this.fields} fileName={Resources.usersWithoutTimeSheet[currentLanguage]} />

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.usersWithoutTimeSheet[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm'>
                    <div className="linebylineInput valid-input alternativeDate">
                        <DatePicker title='startDate'
                            startDate={this.state.startDate}
                            handleChange={e => { this.handleChange('startDate', e); this.fields[0].value = e.label }}
                            maxDate={moment().add('1', 'day')} />
                    </div>
                    <button className="primaryBtn-1 btn smallBtn" onClick={() => this.getGridRows()}>{Resources['search'][currentLanguage]}</button>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

}

export default UserWithOutTimeSheet
