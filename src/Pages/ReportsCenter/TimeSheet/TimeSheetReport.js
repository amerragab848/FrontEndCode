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
import DatePicker from '../../../Componants/OptionsPanels/DatePicker';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    companyName: Yup.string().required(Resources['companyRequired'][currentLanguage]).nullable(true)
})
class timeSheet extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            companiesList: [],
            projectsList: [],
            statusList: [{ label: Resources.all[currentLanguage], value: null },
            { label: Resources.rejected[currentLanguage], value: false },
            { label: Resources.approved[currentLanguage], value: true }],
            contactsList: [],
            selectedContact: { label: Resources.selectContact[currentLanguage], value: 0 },
            selectedProject: { label: Resources.projectSelection[currentLanguage], value: null },
            selectedCompany: { label: Resources.companyRequired[currentLanguage], value: null },
            selectedStatus: { label: Resources.all[currentLanguage], value: null },
            rows: [],
            finishDate: moment(),
            startDate: moment(),
        }

        if (!Config.IsAllow(3709)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

        this.columns = [
            {
                "field": "contactName",
                "title": Resources.ContactName[currentLanguage],
                "type": "text",
                "width": 15,
                "fixed": true,
                "groupable": true,
                "sortable": true
            }, {
                "field": "timesheetDate",
                "title": Resources.docDate[currentLanguage],
                "type": "date",
                "width": 10,
                "groupable": true,
                "sortable": true
            }, {
                "field": "description",
                "title": Resources.description[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "projectName",
                "title": Resources.projectName[currentLanguage],
                "type": "text",
                "width": 20,
                "groupable": true,
                "sortable": true
            }, {
                "field": "refrenceCode",
                "title": Resources.refrenceCode[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "taskName",
                "title": Resources.taskName[currentLanguage],
                "type": "text",
                "width": 10,
                "groupable": true,
                "sortable": true
            }, {
                "field": "hours",
                "title": Resources.hours[currentLanguage],
                "type": "text",
                "width": 10,
                "groupable": true,
                "sortable": true
            }, {
                "field": "country",
                "title": Resources.country[currentLanguage],
                "type": "text",
                "width": 10,
                "groupable": true,
                "sortable": true
            }, {
                "field": "location",
                "title": Resources.location[currentLanguage],
                "type": "text",
                "width": 10,
                "groupable": true,
                "sortable": true
            }, {
                "field": "approvalDate",
                "title": Resources.approvalDate[currentLanguage],
                "type": "date",
                "width": 10,
                "groupable": true,
                "sortable": true
            }, {
                "field": "approvalStatusName",
                "title": Resources.approvalStatus[currentLanguage],
                "type": "text",
                "width": 10,
                "groupable": true,
                "sortable": true
            }
        ];

        this.fields = [{
            title: Resources["CompanyName"][currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources["users"][currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources["Projects"][currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources["status"][currentLanguage],
            value: this.state.selectedStatus.label,
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

    componentDidMount() {
        this.getDataList('GetProjectCompanies?accountOwnerId=2', 'companyName', 'id', 'companiesList');
        this.getDataList('ProjectProjectsGetAll', 'projectName', 'id', 'projectsList');
        if (Config.IsAllow(3737)) {
            this.columns.push(
                {
                    "field": "cost",
                    "title": Resources.cost[currentLanguage],
                    "type": "date",
                    "width": 15,
                    "fixed": true,
                    "groupable": true,
                    "sortable": true
                }
            )
        }
    }

    getGridRows = () => {
        this.setState({ isLoading: true });

        let obj = {
            projectId: this.state.selectedProject.value,
            companyId: this.state.selectedCompany.value,
            contactId: this.state.selectedContact.value,
            status: this.state.selectedStatus.value,
            startDate: moment(this.state.startDate),
            finishDate: moment(this.state.finishDate),
            pageNumber: 0,
            pageSize: 200
        }
        let url = this.state.selectedProject.value != null ? 'GetUsersTimeSheet' : 'GetUsersTimeSheetByAllProjects';
        Api.post(url, obj).then((res) => {
            Api.post('GetUsersTimeSheetSummary', obj).then(timeSheet => {
                this.setState({ timeSheetObj: timeSheet });
            })

            if (res.length > 0) {

                this.setState({
                    rows: res, isLoading: false
                });
            }
            else {
                this.setState({
                    rows: [], isLoading: false, tabelData: []
                });
            }


        }).catch(() => {
            this.setState({ isLoading: false })
        });

    }

    setDate = (name, value) => {
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
            rows={this.state.rows} fields={this.fields} fileName={Resources.timeSheetReport[currentLanguage]} />


        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.timeSheetReport[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className=''>
                    <Formik
                        initialValues={{
                            companyName: this.state.selectedCompany.value
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
                                            this.setState({ selectedCompany: event });
                                            this.fields[0].value = event.label;
                                            this.getDataList('GetContactsByCompanyId?companyId=' + event.value, 'contactName', 'id', 'contactsList');
                                        }}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.companyName}
                                        touched={touched.companyName}
                                    />
                                </div>

                                <div className="linebylineInput valid-input">
                                    <Dropdown title="users" name="ContactName" index="ContactName"
                                        data={this.state.contactsList} selectedValue={this.state.selectedContact}
                                        handleChange={event => { this.setState({ selectedContact: event }); this.fields[1].value = event.label; }} />
                                </div>

                                <div className="linebylineInput valid-input">
                                    <Dropdown title="Projects" name="projectName" index="projects"
                                        data={this.state.projectsList} selectedValue={this.state.selectedProject}
                                        handleChange={event => { this.setState({ selectedProject: event }); this.fields[2].value = event.label; }}
                                    />
                                </div>
                                <div className="linebylineInput valid-input">
                                    <Dropdown title="status" name="status" index="status"
                                        data={this.state.statusList} selectedValue={this.state.selectedStatus}
                                        handleChange={event => { this.setState({ selectedExpenses: event }); this.fields[3].value = event.label; }}
                                    />
                                </div>

                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='startDate'
                                        startDate={this.state.startDate}
                                        handleChange={e => { this.setDate('startDate', e); this.fields[4].value = e }} />
                                </div>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='finishDate'
                                        startDate={this.state.finishDate}
                                        setDate={e => { this.setDate('finishDate', e); this.fields[5].value = e }} />
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
                            <tr  >
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

} export default timeSheet;
