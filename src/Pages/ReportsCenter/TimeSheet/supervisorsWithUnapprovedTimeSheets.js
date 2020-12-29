import React, { Component } from 'react';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import ExportDetails from "../ExportReportCenterDetails";
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import dataservice from "../../../Dataservice";
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import { Formik, Form } from "formik";
import moment from "moment";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class SupervisorsWithUnapprovedTimeSheets extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            rows: [],
            finishDate: moment(),
            startDate: moment(),
            defaultHour: ''
        }

        if (!Config.IsAllow(3713)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push("/");
        }

        this.columns = [{
            "field": "empCode",
            "title": Resources.employeeCode[currentLanguage],
            "type": "text",
            "width": 15,
            "fixed": true,
            "groupable": true,
            "sortable": true
        }, {
            "field": "contactName",
            "title": Resources.ContactName[currentLanguage],
            "type": "text",
            "width": 15,
            "groupable": true,
            "sortable": true
        }, {
            "field": "companyName",
            "title": Resources.CompanyName[currentLanguage],
            "type": "text",
            "width": 15,
            "groupable": true,
            "sortable": true
        }, {
            "field": "supervisorName",
            "title": Resources.Supervisor[currentLanguage],
            "type": "text",
            "width": 15,
            "groupable": true,
            "sortable": true
        }, {
            "field": "timeSheetCount",
            "title": Resources.timeSheetCount[currentLanguage],
            "type": "text",
            "width": 15,
            "groupable": true,
            "sortable": true
        }];

        this.fields = [{
            title: Resources["startDate"][currentLanguage],
            value: this.state.startDate,
            type: "D"
        }, {
            title: Resources["finishDate"][currentLanguage],
            value: this.state.finishDate,
            type: "D"
        }];
    }


    getGridRows = (value) => {
        this.setState({ isLoading: true });

        let obj = {
            startDate: moment(this.state.startDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
            finishDate: moment(this.state.finishDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS")
        }

        dataservice.addObject('GetSupervisorsWithUnapprovedTimeSheets', obj).then((res) => {
            if (res.length > 0) {
                this.setState({
                    rows: res, isLoading: false
                });
            }
            else
                this.setState({
                    rows: [], isLoading: false
                });
        }).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    setDate = (name, value) => {
        this.setState({ [name]: value })
    }

    render() {
        const dataGrid = this.state.isLoading === false ?
            (<GridCustom ref='custom-data-grid' gridKey="SupervisorUnApprovedTimeSheets" groups={[]} data={this.state.rows || []} cells={this.columns}
                pageSize={this.state.rows.length} actions={[]} rowActions={[]} rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = <ExportDetails fieldsItems={this.columns}
            rows={this.state.rows} fields={this.fields} fileName={Resources.supervisorsWithUnapprovedTimeSheets[currentLanguage]} />

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.supervisorsWithUnapprovedTimeSheets[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div>
                    <Formik enableReinitialize={true}
                        onSubmit={(values) => {
                            this.getGridRows()
                        }}>
                        {({ errors, touched, handleSubmit, handleChange, handleBlur }) => (
                            <Form id="InspectionRequestForm" className='proForm reports__proForm datepickerContainer'noValidate="novalidate" onSubmit={handleSubmit}>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='startDate'
                                        startDate={this.state.startDate}
                                        handleChange={e => { this.setDate('startDate', e); this.fields[0].value = e }} />
                                </div>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='finishDate'
                                        startDate={this.state.finishDate}
                                        setDate={e => { this.setDate('finishDate', e); this.fields[1].value = e }} />
                                </div>
                                <button className="primaryBtn-1 btn smallBtn"  >{Resources['search'][currentLanguage]}</button>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }
}

export default SupervisorsWithUnapprovedTimeSheets;
