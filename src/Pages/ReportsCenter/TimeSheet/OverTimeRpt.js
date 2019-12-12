import React, { Component } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import dataservice from "../../../Dataservice";
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
}
const validationSchema = Yup.object().shape({
    companyName: Yup.string().required(Resources['companyRequired'][currentLanguage]).nullable(true)
})
class overtTimeRpt extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            companiesList: [],
            projectsList: [],
            contactsList: [],
            selectedContact: { label: Resources.selectContact[currentLanguage], value: null },
            selectedProject: { label: Resources.projectSelection[currentLanguage], value: null },
            selectedCompany: { label: Resources.companyRequired[currentLanguage], value: null },
            rows: [],
            finishDate: moment(),
            startDate: moment(),
        }

        if (!Config.IsAllow(3708)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });

        }
        this.columns = [
            {
                key: "docDate",
                name: Resources["timesheetDate"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate,
                frozen: true,
            }, {
                key: "contactName",
                name: Resources["ContactName"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                frozen: true
            }, {
                key: "description",
                name: Resources["description"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                frozen: true
            }, {
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "refrenceCode",
                name: Resources["refrenceCode"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "taskName",
                name: Resources["taskName"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "hours",
                name: Resources["hours"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "country",
                name: Resources["country"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
            }, {
                key: "location",
                name: Resources["location"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
            }, {
                key: "approvalStatusName",
                name: Resources["approvalStatus"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
            }
        ];
    }

    componentDidMount() {
        this.getDataList('GetProjectCompanies?accountOwnerId=2', 'companyName', 'id', 'companiesList');
        this.getDataList('ProjectProjectsGetAll', 'projectName', 'id', 'projectsList');
        if (Config.IsAllow(3737)) {
            this.columns.push(
                {
                    key: "cost",
                    name: Resources["cost"][currentLanguage],
                    width: 100,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
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
            startDate: moment(this.state.startDate),
            finishDate: moment(this.state.finishDate),
            pageNumber: 0,
            pageSize: 200
        }
        Api.post('GetUsersOverTimes', obj).then((res) => {

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
            <GridSetup rows={this.state.rows} showCheckbox={false}
                selectedCopmleteRow={true}
                pageSize={this.state.pageSize} columns={this.columns} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={Resources['overtime'][currentLanguage]} />
            : null


        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.overtime[currentLanguage]}</h2>
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
                            <Form id="InspectionRequestForm" className="proForm reports__proForm" noValidate="novalidate" onSubmit={handleSubmit}>

                                <div className="linebylineInput valid-input">
                                    <Dropdown title="CompanyName" name="companyName" index="companyName"
                                        data={this.state.companiesList} selectedValue={this.state.selectedCompany}
                                        handleChange={event => {
                                            this.setState({ selectedCompany: event })
                                            this.getDataList('GetContactsByCompanyId?companyId=' + event.value, 'contactName', 'id', 'contactsList');
                                        }}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.companyName}
                                        touched={touched.companyName}
                                    />
                                </div>

                                <div className="linebylineInput valid-input">
                                    <Dropdown title="ContactName" name="ContactName" index="ContactName"
                                        data={this.state.contactsList} selectedValue={this.state.selectedContact}
                                        handleChange={event => this.setState({ selectedContact: event })} />
                                </div>

                                <div className="linebylineInput valid-input">
                                    <Dropdown title="Projects" name="projectName" index="projects"
                                        data={this.state.projectsList} selectedValue={this.state.selectedProject}
                                        handleChange={event => this.setState({ selectedProject: event })}
                                    />
                                </div>

                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='startDate'
                                        startDate={this.state.startDate}
                                        handleChange={e => this.setDate('startDate', e)} />
                                </div>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='finishDate'
                                        startDate={this.state.finishDate}
                                        setDate={e => this.setDate('finishDate', e)} />
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

} export default overtTimeRpt;
