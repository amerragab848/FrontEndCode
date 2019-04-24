import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../../Dataservice";
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
const _ = require('lodash')

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const companySchema = Yup.object().shape({
    selectedCompany: Yup.string()
        .required(Resources['ComapnyNameRequired'][currentLanguage])
        .nullable(true),
});
const projectSchema = Yup.object().shape({
    selectedProject: Yup.string()
        .required(Resources['projectRequired'][currentLanguage])
        .nullable(true),
});
class allocationOfProjectsOnCompanies extends Component {

    constructor(props) {
        super(props)
        this.projectColumns = [
            {
                key: 'projectName',
                name: Resources['Projects'][currentLanguage],
                width: 500,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }];
        this.companyColumns = [
            {
                key: 'companyName',
                name: Resources['Companies'][currentLanguage],
                width: 500,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }];

        this.state = {
            isLoading: false,
            showGrid:false,
            companyList: [],
            projectList: [],
            current: 0,
            currentColumns: this.projectColumns,
            selectedCompany: { label: Resources.ComapnyNameRequired[currentLanguage], value: "0" },
            selectedProject: { label: Resources.projectRequired[currentLanguage], value: "0" },
            rows: [],
            status: true
        }

        if (!Config.IsAllow(3682)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

    }


    componentWillMount() {
        let AOI = Config.getPayload().aoi
        dataservice.GetDataList('GetCompanies?accountOwnerId=' + AOI, 'companyName', 'id').then(result => {
            this.setState({
                companyList: result
            });
        }).catch(() => {
            toast.error('somthing wrong')
        })
        dataservice.GetDataList('ProjectProjectsGetAll', 'projectName', 'id').then(result => {
            this.setState({
                projectList: result
            });
        }).catch(() => {
            toast.error('somthing wrong')
        })
    }
    getGridRows = () => {
        this.setState({ isLoading: true })
        if (this.state.current == 0) {
            Api.get('GetProjectProjectsCompaniesByCompanyId?companyId=' + this.state.selectedCompany.value).then((res) => {
                this.setState({ rows: res, isLoading: false,showGrid:true })
            }).catch(() => {
                this.setState({ isLoading: false })
            })
        } else {
            Api.get('SelectAllByProjectIdName?projectId=' + this.state.selectedProject.value).then((res) => {
                this.setState({ rows: res, isLoading: false,showGrid:true })
            }).catch(() => {
                this.setState({ isLoading: false })
            })
        }


    }
    handleChange = (e) => {
        if (this.state.current == 0)
            this.setState({ selectedCompany: e })
        else
            this.setState({ selectedProject: e })
    }

    render() {
        let currentForm = <Fragment>
            {this.state.current == 0 ?
                <Formik
                    initialValues={{
                        selectedCompany: '',
                    }}
                    enableReinitialize={true}
                    validationSchema={companySchema}
                    onSubmit={(values, actions) => {
                        this.getGridRows()
                    }}>
                    {({ errors, touched, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                        <Form onSubmit={handleSubmit} className='proForm reports__proForm'>
                            <div className="linebylineInput valid-input">
                                <Dropdown title='CompanyName' data={this.state.companyList}
                                    name='selectedCompany'
                                    selectedValue={this.state.selectedCompany}
                                    onChange={setFieldValue}
                                    handleChange={e => this.setState({ selectedCompany: e })}
                                    onBlur={setFieldTouched}
                                    error={errors.selectedCompany}
                                    touched={touched.selectedCompany}
                                    value={values.selectedCompany} />
                            </div>
                            <button className="primaryBtn-1 btn smallBtn" type='submit'>{Resources['search'][currentLanguage]}</button>
                        </Form>
                    )}
                </Formik> :
                <Formik
                    initialValues={{
                        selectedProject: '',
                    }}
                    enableReinitialize={true}
                    validationSchema={projectSchema}
                    onSubmit={(values, actions) => {
                        this.getGridRows()
                    }}>
                    {({ errors, touched, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                        <Form onSubmit={handleSubmit} className='proForm reports__proForm'>
                            <div className="linebylineInput valid-input">
                                <Dropdown title='projectName' data={this.state.projectList}
                                    name='selectedProject'
                                    selectedValue={this.state.selectedProject}
                                    onChange={setFieldValue}
                                    handleChange={e => this.setState({ selectedProject: e })}
                                    onBlur={setFieldTouched}
                                    error={errors.selectedProject}
                                    touched={touched.selectedProject}
                                    value={values.selectedProject} />
                            </div>
                            <button className="primaryBtn-1 btn smallBtn" type='submit'>{Resources['search'][currentLanguage]}</button>
                        </Form>
                    )}
                </Formik>}</Fragment>

        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                pageSize={this.state.pageSize} columns={this.state.currentColumns} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.currentColumns} fileName={'projectsAllocationOnCompanies'} />
            : null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.projectsAllocationOnCompanies[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm' style={{ marginBottom: '0' }}>
                    <div className="linebylineInput valid-input">
                        <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" name="status" defaultChecked="checked" onChange={e => this.setState({ current: 0, rows: [], currentColumns: this.projectColumns,showGrid:false })} />
                            <label>{Resources['Projects'][currentLanguage]}</label>
                        </div>
                    </div>
                    <div className="linebylineInput valid-input">
                        <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" name="status" onChange={e => this.setState({ current: 1, rows: [], currentColumns: this.companyColumns ,showGrid:false})} />
                            <label>{Resources['Companies'][currentLanguage]}</label>
                        </div>
                    </div>
                </div>
                {currentForm}
                {this.state.showGrid == true ?
                    <div className="doc-pre-cycle letterFullWidth">
                        {dataGrid}
                    </div> :null}
            </div>


        )
    }

}


export default allocationOfProjectsOnCompanies
