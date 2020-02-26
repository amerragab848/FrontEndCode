import React, { Component } from 'react';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Export from "../../../Componants/OptionsPanels/Export";
import GridCustom from 'react-customized-grid';
import dataservice from "../../../Dataservice";
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
import ExportDetails from "../ExportReportCenterDetails";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    defaultHour: Yup.string().required(Resources['defaultHours'][currentLanguage]).nullable(true)
})
class OverTimeReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            rows: [],
            finishDate: moment(),
            startDate: moment(),
            defaultHour: ''
        }

        if (!Config.IsAllow(3710)) {
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
            "width": 30,
            "groupable": true,
            "sortable": true
        }, {
            "field": "companyName",
            "title": Resources.CompanyName[currentLanguage],
            "type": "text",
            "width": 30,
            "groupable": true,
            "sortable": true
        }, {
            "field": "totalOvertime",
            "title": Resources.actualHours[currentLanguage],
            "type": "text",
            "width": 15,
            "groupable": true,
            "sortable": true
        }];

        this.fields = [{
            title: Resources["defaultHours"][currentLanguage],
            value: "",
            type: "text"
        }, {
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
            defaultHour: this.state.defaultHour,
            startDate: moment(this.state.startDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
            finishDate: moment(this.state.finishDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS")
        }

        dataservice.addObject('GetUsersOverTime', obj).then((res) => {
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

    handleChange = (event) => {
        this.setState({ defaultHour: event.target.value })
    }

    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridCustom ref='custom-data-grid' groups={[]} data={this.state.rows || []} cells={this.columns}
                pageSize={this.state.rows.length} actions={[]} rowActions={[]} rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = <ExportDetails fieldsItems={this.columns}
            rows={this.state.rows} fields={this.fields} fileName={Resources.overTimeSheet[currentLanguage]} />

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.overTimeSheet[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div>
                    <Formik initialValues={{ defaultHour: '' }}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={(values) => {
                            this.getGridRows()
                        }}>
                        {({ errors, touched, handleSubmit, handleChange, handleBlur }) => (
                            <Form id="InspectionRequestForm" className="proForm reports__proForm" noValidate="novalidate" onSubmit={handleSubmit}>
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">
                                        {Resources.defaultHours[currentLanguage]}
                                    </label>
                                    <div className={"ui input inputDev fillter-item-c " + (errors.defaultHour && touched.defaultHour ? "has-error" : !errors.defaultHour && touched.defaultHour ? "has-success" : "")} >
                                        <input type="text" className="form-control" value={this.state.defaultHour || ''} name="defaultHour" placeholder={Resources.defaultHours[currentLanguage]}
                                            onBlur={e => { handleChange(e); handleBlur(e); }}
                                            onChange={e => { this.handleChange(e); this.fields[0].value = e.target.value }} />
                                        {errors.defaultHour && touched.defaultHour ? (<em className="pError">{errors.defaultHour}</em>) : null}
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='startDate'
                                        startDate={this.state.startDate}
                                        handleChange={e => { this.setDate('startDate', e); this.fields[1].value = e }} />
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

export default OverTimeReport;
