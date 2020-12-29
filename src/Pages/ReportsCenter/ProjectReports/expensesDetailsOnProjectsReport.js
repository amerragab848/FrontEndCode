import React, { Component } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import Config from '../../../Services/Config';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Export from "../../../Componants/OptionsPanels/Export";
import moment from "moment";
import dataService from '../../../Dataservice';
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import BarChartComp from '../TechnicalOffice/BarChartComp';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ExportDetails from "../ExportReportCenterDetails";

const sumBy = require('lodash/sumBy')
const _ = require("lodash");

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const ValidtionSchema = Yup.object().shape({
    selectedProject: Yup.string().required(Resources['projectSelection'][currentLanguage]).nullable(true)
});

class expensesDetailsOnProjectsReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showChart: false,
            projectsList: [],
            companiesList: [],
            usersList: [],
            rows: [],
            projectIds: [],
            selectedCompany: { label: Resources.selectCompany[currentLanguage], value: "-1" },
            selectedUser: { label: Resources.users[currentLanguage], value: "-1" },
            finishDate: moment(),
            startDate: moment(),
            pageSize: 200,
            series: [],
            columns: [
                {
                    field: "projectName",
                    title: Resources["projectName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: true,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "docDate",
                    title: Resources["docDate"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "date",
                    sortable: true,
                }, {
                    field: "expenseValue",
                    title: Resources["expenseValue"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                }, {
                    field: "expenseTypeName",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                }
            ]
        }

        if (!Config.IsAllow(3685)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

        this.fields = [{
            title: Resources["Projects"][currentLanguage],
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
        this.setState({ isLoading: true })
        dataService.GetDataList('ProjectProjectsForList', 'projectName', 'id').then(res => {
            this.setState({ projectsList: res, isLoading: false })
        })
        this.setState({ isLoading: true })
        dataService.GetDataList('SelectAllCompany', 'companyName', 'id').then(res => {
            this.setState({ companiesList: res, isLoading: false })
        })
    }

    getGridtData = () => {
        this.setState({ currentComponent: null })
        let reportobj = {
            projectIds: this.state.projectIds,
            companyId: this.state.selectedCompany.value == -1 ? undefined : this.state.selectedCompany.value,
            contactId: this.state.selectedUser.value == -1 ? undefined : this.state.selectedUser.value,
            start: moment(this.state.startDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            finish: moment(this.state.finishDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
        }
        this.setState({ isLoading: true })
        Api.post('ExpensesDetailsOnProjectReport', reportobj).then(res => {
            let rows = res == null ? [] : res;
            this.setState({ showChart: true });

            let seriesData = _(res)
                .groupBy(x => x.projectName)
                .map((objs, key) => (
                    {
                        'name': key,
                        'value': sumBy(objs, 'expenseValue')
                    })).value();

            this.setState({ rows, isLoading: false, showChart: true, series: seriesData })
        }).catch(() => {
            this.setState({ isLoading: false, rows: [] })
            toast.error(Resources.operationCanceled[currentLanguage])
        })


    }

    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }

    companyChange = (e) => {
        this.setState({ isLoading: true, selectedCompany: e })
        dataService.GetDataList('GetContactsByCompanyIdForOnlyUsers?companyId=' + e.value, 'contactName', 'id').then(res => {
            let usersData = res != null ? res : []
            this.setState({ usersData, isLoading: false, selectedUser: { label: Resources.users[currentLanguage], value: "-1" } })
        })
    }

    HandleChangeProject = (e) => {
        let projectIds = []
        e.forEach(project => {
            projectIds.push(project.value)
        })
        this.setState({ projectIds })
    }

    render() {

        let Chart = this.state.showChart ?
            (<BarChartComp series={this.state.series} multiSeries="no"
                title={Resources['expensesDetailsOnProjectsReport'][currentLanguage]}
                yTitle={Resources['total'][currentLanguage]} />) : null

        const dataGrid = this.state.isLoading === false ? (
            <GridCustom
                ref='custom-data-grid'
                gridKey="expensesDetailsOnProjectsReport"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.state.columns}
                rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = <ExportDetails fieldsItems={this.state.columns}
            rows={this.state.rows} fields={this.fields} fileName={Resources.expensesDetailsOnProjectsReport[currentLanguage]} />

        return (

            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.expensesDetailsOnProjectsReport[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <Formik
                    initialValues={{
                        selectedProject: ''
                    }}
                    enableReinitialize={true}
                    validationSchema={ValidtionSchema}
                    onSubmit={() => {
                        this.getGridtData()
                    }}>
                    {({ errors, touched, handleSubmit, setFieldTouched, setFieldValue }) => (
                        <Form onSubmit={handleSubmit} className='proForm reports__proForm datepickerContainer' >
                            <div className="reportsWithMulti">
                                <div className="reports__multiDrop letterFullWidth">
                                    <div className="linebylineInput multiChoice">
                                        <Dropdown title='Projects' data={this.state.projectsList}
                                            name='selectedProject'
                                            onChange={setFieldValue}
                                            isMulti={true}
                                            handleChange={e => {
                                                this.HandleChangeProject(e);
                                                let documentText = '';
                                                e.map(lable => {
                                                    return documentText = lable.label + " - " + documentText
                                                });
                                                this.fields[0].value = documentText
                                            }}
                                            onBlur={setFieldTouched}
                                            error={errors.selectedProject}
                                            touched={touched.selectedProject}
                                        />
                                    </div>
                                </div>
                                <div className="reports__smallInputs">
                                    <div className="linebylineInput valid-input ">
                                        <Dropdown title='CompanyName' data={this.state.companiesList}
                                            name='selectedCompany'
                                            selectedValue={this.state.selectedCompany}
                                            handleChange={e => { this.companyChange(e); this.fields[1].value = e.label }}
                                        />
                                    </div>
                                    <div className="linebylineInput valid-input " >
                                        <Dropdown title='users' data={this.state.usersData}
                                            name='selectUser'
                                            selectedValue={this.state.selectedUser}
                                            handleChange={e => { this.setState({ selectedUser: e }); this.fields[2].value = e.label }}
                                        />
                                    </div>
                                    <div className="linebylineInput valid-input alternativeDate">
                                        <DatePicker title='startDate'
                                            startDate={this.state.startDate}
                                            handleChange={e => { this.handleChange('startDate', e); this.fields[3].value = e }} />
                                    </div>
                                    <div className="linebylineInput valid-input alternativeDate">
                                        <DatePicker title='finishDate'
                                            startDate={this.state.finishDate}
                                            handleChange={e => { this.handleChange('finishDate', e); this.fields[4].value = e }} />
                                    </div>
                                </div>
                            </div>
                            <div className="button__reports">
                                <button className="primaryBtn-1 btn smallBtn" type='submit'>{Resources['search'][currentLanguage]}</button>
                            </div>
                        </Form>
                    )}
                </Formik>
                {this.state.showChart == true ?
                    <div className="row">
                        {Chart}
                    </div> : null}
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

}


export default expensesDetailsOnProjectsReport
