import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import Config from '../../../Services/Config';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Export from "../../../Componants/OptionsPanels/Export";
import moment from "moment";
import dataService from '../../../Dataservice'
import GridSetup from "../../Communication/GridSetup"
import BarChartComp from '../TechnicalOffice/BarChartComp'
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
const sumBy = require('lodash/sumBy')
const groupBy = require('lodash/groupBy')
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const ValidtionSchema = Yup.object().shape({
    selectedProject: Yup.string().required(Resources['projectSelection'][currentLanguage]).nullable(true)
});
const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};
class expensesDetailsOnProjectsReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showChart:false,
            projectsList: [],
            companiesList: [],
            usersList: [],
            rows: [],
            projectIds: [],
            selectedCompany: { label: Resources.selectCompany[currentLanguage], value: "-1" },
            selectedUser: { label: Resources.users[currentLanguage], value: "-1" },
            finishDate: moment(),
            startDate: moment(),
            series:[],
            columns: [
                {
                    key: "projectName",
                    name: Resources["projectName"][currentLanguage],
                    width: 180,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                },
                {
                    key: "docDate",
                    name: Resources["docDate"][currentLanguage],
                    width: 180,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true,
                    formatter: dateFormate
                }, {
                    key: "expenseValue",
                    name: Resources["expenseValue"][currentLanguage],
                    width: 180,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                }, {
                    key: "expenseTypeName",
                    name: Resources["expenseTypeName"][currentLanguage],
                    width: 180,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                }
            ]
        }

        if (!Config.IsAllow(3685)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        } 
    }
    componentWillMount() {
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
            start: moment(this.state.startDate,'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            finish: moment(this.state.finishDate,'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
        }
        this.setState({ isLoading: true })
        Api.post('ExpensesDetailsOnProjectReport', reportobj).then(res => {
            let rows = res == null ? [] : res;
            this.setState({showChart:true});

            let seriesData = groupBy(res).groupBy('projectName').map((objs, key) => {
                                return {
                                    'name': key,
                                    'value': sumBy(objs, 'expenseValue')
                                }}).value();
  
            this.setState({ rows, isLoading: false,showChart:true,series:seriesData })
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
        (<BarChartComp  series={this.state.series}  multiSeries="no"
            title={Resources['expensesDetailsOnProjectsReport'][currentLanguage]}
            yTitle={Resources['total'][currentLanguage]} />) :null
        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                pageSize={this.state.pageSize} columns={this.state.columns} />) : <LoadingSection />
        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={'expensesDetailsOnProjectsReport'} />
            : null
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
                        <Form onSubmit={handleSubmit} className='proForm reports__proForm' >
                            <div className="reportsWithMulti">
                                <div className="reports__multiDrop letterFullWidth">
                                    <div className="linebylineInput multiChoice">
                                        <Dropdown title='Projects' data={this.state.projectsList}
                                            name='selectedProject'
                                            onChange={setFieldValue}
                                            isMulti={true}
                                            handleChange={e => this.HandleChangeProject(e)}
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
                                            handleChange={e => this.companyChange(e)}
                                        />
                                    </div>
                                    <div className="linebylineInput valid-input " >
                                        <Dropdown title='users' data={this.state.usersData}
                                            name='selectUser'
                                            selectedValue={this.state.selectedUser}
                                            handleChange={e => this.setState({ selectedUser: e })}
                                        />
                                    </div>
                                    <div className="linebylineInput valid-input alternativeDate">
                                        <DatePicker title='startDate'
                                            startDate={this.state.startDate}
                                            handleChange={e => this.handleChange('startDate', e)} />
                                    </div>
                                    <div className="linebylineInput valid-input alternativeDate">
                                        <DatePicker title='finishDate'
                                            startDate={this.state.finishDate}
                                            handleChange={e => this.handleChange('finishDate', e)} />
                                    </div>
                                </div>
                            </div>
                            <div className="button__reports">
                                <button className="primaryBtn-1 btn smallBtn" type='submit'>{Resources['search'][currentLanguage]}</button>
                            </div>
                        </Form>
                    )}
                </Formik>
                {this.state.showChart==true?
                    <div className="row">
                        {Chart}
                    </div>:null}
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

}


export default expensesDetailsOnProjectsReport
