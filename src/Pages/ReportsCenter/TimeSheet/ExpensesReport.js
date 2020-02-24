import React, { Component } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous';
import ExportDetails from "../ExportReportCenterDetails";
import dataservice from "../../../Dataservice";
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import GridCustom from 'react-customized-grid';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    expensesType: Yup.string().required(Resources['companyRequired'][currentLanguage]).nullable(true)
})
class ExpensesReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            companiesList: [],
            projectsList: [],
            expensesList: [],
            contactsList: [],
            selectedContact: { label: Resources.selectContact[currentLanguage], value: 0 },
            selectedProject: { label: Resources.projectSelection[currentLanguage], value: null },
            selectedCompany: { label: Resources.companyRequired[currentLanguage], value: null },
            selectedExpenses: { label: Resources.expensesTypeRequired[currentLanguage], value: null },
            tabelData: [],
            rows: [],
            finishDate: moment(),
            startDate: moment(),
        }

        if (!Config.IsAllow(3716)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });

        }

        this.columns = [{
            "field": "projectName",
            "title": Resources.projectName[currentLanguage],
            "type": "text",
            "width": 15,
            "fixed": true,
            "groupable": true,
            "sortable": true
        }, {
            "field": "docDate",
            "title": Resources.docDate[currentLanguage],
            "type": "date",
            "width": 15,
            "groupable": true,
            "sortable": true
        }, {
            "field": "expenseValue",
            "title": Resources.expenseValue[currentLanguage],
            "type": "text",
            "width": 15,
            "groupable": true,
            "sortable": true
        }, {
            "field": "expenseTypeName",
            "title": Resources.expenseTypeName[currentLanguage],
            "type": "text",
            "width": 15,
            "groupable": true,
            "sortable": true
        }
        ];

        this.fields = [{
            title: Resources["Projects"][currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources["expensesType"][currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources["CompanyName"][currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources["users"][currentLanguage],
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

    componentDidMount() {
        this.getDataList('SelectAllCompany', 'companyName', 'id', 'companiesList');
        this.getDataList('ProjectProjectsGetAll', 'projectName', 'id', 'projectsList');
        this.getDataList('GetaccountsDefaultlistTypesNotAction?listType=expensestype&action=1', 'title', 'id', 'expensesList');
    }

    getGridRows = () => {
        this.setState({ isLoading: true });

        let obj = {
            projectId: this.state.selectedProject.value,
            companyId: this.state.selectedCompany.value,
            contactId: this.state.selectedContact.value,
            expensesTypeId: this.state.selectedExpenses.value,
            start: moment(this.state.startDate),
            finish: moment(this.state.finishDate)
        }
        Api.post('ExpensesDetailsReport', obj).then((res) => {
            if (res.length > 0) {
                let data = [];
                res.forEach(item => {
                    let total = 0;
                    res.forEach(element => {
                        if (item.projectId == element.projectId)
                            total += element.expenseValue
                    });
                    if (!data.filter(function (e) { return e.projectId === item.projectId; }).length > 0) {
                        data.push({
                            projectId: item.projectId,
                            projectName: item.projectName,
                            total: total
                        });
                    }
                })
                this.setState({
                    rows: res, isLoading: false, tabelData: data
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
            rows={this.state.rows} fields={this.fields} fileName={Resources.expensesReport[currentLanguage]} />

        let tabel =
            this.state.tabelData.map((item, Index) => {
                return (
                    <tr key={Index}>
                        <td>
                            <div className="contentCell tableCell-3">
                                <p className="zero status">
                                    {item.projectName}
                                </p>
                            </div>
                        </td>
                        <td>
                            <div className="contentCell tableCell-4">
                                <p className="zero">
                                    {item.total}
                                </p>
                            </div>
                        </td>
                    </tr>
                );
            })
        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.expensesReport[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className=''>
                    <Formik
                        initialValues={{
                            expensesType: this.state.selectedExpenses.value
                        }}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={() => {
                            this.getGridRows()
                        }}>
                        {({ errors, touched, handleSubmit, setFieldValue, setFieldTouched }) => (
                            <Form id="InspectionRequestForm" className="proForm reports__proForm" noValidate="novalidate" onSubmit={handleSubmit}>
                                <div className="linebylineInput valid-input">
                                    <Dropdown title="Projects" name="projectName" index="projects"
                                        data={this.state.projectsList} selectedValue={this.state.selectedProject}
                                        handleChange={event => { this.setState({ selectedProject: event }); this.fields[0].value = event.label }}
                                    />
                                </div>
                                <div className="linebylineInput valid-input">
                                    <Dropdown title="expensesType" name="expensesType" index="expensesType"
                                        data={this.state.expensesList} selectedValue={this.state.selectedExpenses}
                                        handleChange={event => { this.setState({ selectedExpenses: event }); this.fields[1].value = event.label }}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.expensesType}
                                        touched={touched.expensesType}
                                    />
                                </div>
                                <div className="linebylineInput valid-input">
                                    <Dropdown title="CompanyName" name="companyName" index="companyName"
                                        data={this.state.companiesList} selectedValue={this.state.selectedCompany}
                                        handleChange={event => {
                                            this.setState({ selectedCompany: event });
                                            this.fields[2].value = event.label
                                            this.getDataList('GetContactsByCompanyId?companyId=' + event.value, 'contactName', 'id', 'contactsList');
                                        }}
                                    />
                                </div>
                                <div className="linebylineInput valid-input">
                                    <Dropdown title="users" name="ContactName" index="ContactName"
                                        data={this.state.contactsList} selectedValue={this.state.selectedContact}
                                        handleChange={event => {
                                            this.setState({ selectedContact: event });
                                            this.fields[3].value = event.label
                                        }} />
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
                <table className="attachmentTable">
                    <thead>
                        <tr>
                            <th>
                                <div className="headCell tableCell-1">
                                    <span>
                                        {Resources["projectName"][currentLanguage]}
                                    </span>
                                </div>
                            </th>
                            <th>
                                <div className="headCell tableCell-2">
                                    <span>
                                        {Resources["total"][currentLanguage]}
                                    </span>
                                </div>
                            </th>

                        </tr>
                    </thead>
                    <tbody>{tabel}</tbody>
                </table>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

} export default ExpensesReport;
