import React, { Component } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous';
import ExportDetails from "../ExportReportCenterDetails";
import GridCustom from 'react-customized-grid';
import dataservice from "../../../Dataservice";
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    contactName: Yup.string().required(Resources['contactNameRequired'][currentLanguage]).nullable(true)
})
class projectTotaltimeSheet extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            companiesList: [],
            contactsList: [],
            selectedContact: { label: Resources.selectContact[currentLanguage], value: null },
            selectedCompany: { label: Resources.companyRequired[currentLanguage], value: null },
            rows: [],
            finishDate: moment(),
            startDate: moment(),
            employeeCode: 0,
            timeSheetObj: null
        }

        if (!Config.IsAllow(3714)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });

        }

        this.fields = [{
            title: Resources["CompanyName"][currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources["ContactName"][currentLanguage],
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
        }, {
            title: Resources["employeeCode"][currentLanguage],
            value: "",
            type: "text"
        }];

        this.columns = [{
            "field": "projectName",
            "title": Resources.projectName[currentLanguage],
            "type": "text",
            "width": 15,
            "fixed": true,
            "groupable": true,
            "sortable": true
        }, {
            "field": "projectCode",
            "title": Resources.projectCode[currentLanguage],
            "type": "text",
            "width": 15,
            "groupable": true,
            "sortable": true
        }, {
            "field": "hours",
            "title": Resources.hours[currentLanguage],
            "type": "text",
            "width": 15,
            "groupable": true,
            "sortable": true
        }
        ];
    }

    componentDidMount() {
        this.getDataList('GetProjectCompanies?accountOwnerId=2', 'companyName', 'id', 'companiesList');
    }

    getGridRows = () => {
        this.setState({ isLoading: true });

        let obj = {
            empCode: this.state.employeeCode,
            companyId: this.state.selectedCompany.value,
            contactId: this.state.selectedContact.value,
            startDate: moment(this.state.startDate),
            finishDate: moment(this.state.finishDate)
        }
        Api.post('GetProjectTotalTimeSheet', obj).then((res) => {

            Api.post('GetProjectTotalTimeSheetSummary', obj).then(timeSheet => {
                this.setState({ timeSheetObj: timeSheet });
            })

            if (res.length > 0) {
                this.setState({
                    rows: res, isLoading: false
                });
            }
            else {
                this.setState({
                    rows: [], isLoading: false
                });
            }


        }).catch(() => {
            this.setState({ isLoading: false })
        })

    }

    setData = (name, value) => {
        this.setState({ [name]: value })
    }

    getDataList = (api, title, value, targetState) => {

        this.setState({ isLoading: true });
        dataservice.GetDataList(api, title, value).then(result => {
            this.setState({
                [targetState]: result,
                isLoading: false
            });
        }).catch(() => {
            this.setState({
                [targetState]: [],
                isLoading: false
            });
            toast.error('somthing wrong')
        })
    }


    render() {

        const dataGrid = this.state.isLoading === false ? (
            <GridCustom ref='custom-data-grid' groups={[]} data={this.state.rows || []} cells={this.columns}
                pageSize={this.state.rows.length} actions={[]} rowActions={[]} rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = <ExportDetails fieldsItems={this.columns}
            rows={this.state.rows} fields={this.fields} fileName={Resources.projectTotaltimeSheetRpt[currentLanguage]} />

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.projectTotaltimeSheetRpt[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className=''>
                    <Formik
                        initialValues={{
                            contactName: this.state.selectedContact.value
                        }}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={() => {
                            this.getGridRows()
                        }}>
                        {({ errors, touched, handleSubmit, setFieldValue, setFieldTouched }) => (
                            <Form id="InspectionRequestForm" className='proForm reports__proForm datepickerContainer'noValidate="novalidate" onSubmit={handleSubmit}>

                                <div className="linebylineInput valid-input">
                                    <Dropdown title="CompanyName" name="companyName" index="companyName"
                                        data={this.state.companiesList} selectedValue={this.state.selectedCompany}
                                        handleChange={event => {
                                            this.setState({ selectedCompany: event })
                                            this.fields[0].value = event.label
                                            this.getDataList('GetContactsByCompanyId?companyId=' + event.value, 'contactName', 'id', 'contactsList');
                                        }}
                                    />
                                </div>
                                <div className="linebylineInput valid-input">
                                    <Dropdown title="ContactName" name="ContactName" index="ContactName"
                                        data={this.state.contactsList} selectedValue={this.state.selectedContact}
                                        handleChange={event => {
                                            this.setState({ selectedContact: event });
                                            this.fields[1].value = event.label
                                        }}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.contactName}
                                        touched={touched.contactName}
                                    />
                                </div>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='startDate'
                                        startDate={this.state.startDate}
                                        handleChange={e => { this.setData('startDate', e); this.fields[2].value = e }} />
                                </div>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='finishDate'
                                        startDate={this.state.finishDate}
                                        setDate={e => { this.setData('finishDate', e); this.fields[3].value = e }} />
                                </div>

                                <div className="linebylineInput valid-input">
                                    <label className="control-label">
                                        {Resources.employeeCode[currentLanguage]}
                                    </label>
                                    <div className="inputDev ui input"   >
                                        <input name="employeeCode" id="employeeCode" className="form-control fsadfsadsa"
                                            placeholder={Resources.employeeCode[currentLanguage]}
                                            autoComplete="off"
                                            value={this.state.employeeCode}
                                            onChange={e => { this.setData("employeeCode", e.target.value); this.fields[4].value = e.target.value }} />
                                    </div>
                                </div>
                                <button className="primaryBtn-1 btn smallBtn"  >{Resources['search'][currentLanguage]}</button>
                            </Form>
                        )}
                    </Formik>
                </div>
                {this.state.timeSheetObj != null ?
                    <table className="attachmentTable">
                        <thead>
                            <tr>
                                <th>
                                    <div className="headCell tableCell-1">
                                        <span>
                                            {Resources["ContactName"][currentLanguage]}
                                        </span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell tableCell-1">
                                        <span>
                                            {Resources["employeeCode"][currentLanguage]}
                                        </span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell tableCell-2">
                                        <span>
                                            {Resources["userRate"][currentLanguage]}
                                        </span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell tableCell-2">
                                        <span>
                                            {Resources["approvedHours"][currentLanguage]}
                                        </span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell tableCell-2">
                                        <span>
                                            {Resources["rejectedHours"][currentLanguage]}
                                        </span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell tableCell-2">
                                        <span>
                                            {Resources["peroidExpenses"][currentLanguage]}
                                        </span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell tableCell-2">
                                        <span>
                                            {Resources["pendingHours"][currentLanguage]}
                                        </span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell tableCell-2">
                                        <span>
                                            {Resources["totalHours"][currentLanguage]}
                                        </span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="contentCell tableCell-3">
                                        <p className="zero status">
                                            {this.state.timeSheetObj.contactName}
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <div className="contentCell tableCell-4">
                                        <p className="zero">
                                            {this.state.timeSheetObj.empCode}
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <div className="contentCell tableCell-4">
                                        <p className="zero">
                                            {this.state.timeSheetObj.userRate}
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <div className="contentCell tableCell-4">
                                        <p className="zero">
                                            {this.state.timeSheetObj.approvedHours}
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <div className="contentCell tableCell-4">
                                        <p className="zero">
                                            {this.state.timeSheetObj.rejectedHours}
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <div className="contentCell tableCell-4">
                                        <p className="zero">
                                            {this.state.timeSheetObj.peroidExpenses}
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <div className="contentCell tableCell-4">
                                        <p className="zero">
                                            {this.state.timeSheetObj.pendingHours}
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <div className="contentCell tableCell-4">
                                        <p className="zero">
                                            {this.state.timeSheetObj.hours}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table> : null}
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

} export default projectTotaltimeSheet;
