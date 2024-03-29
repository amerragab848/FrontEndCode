import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config'; 
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../../Dataservice";
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous';
import ExportDetails from "../ExportReportCenterDetails";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const companySchema = Yup.object().shape({
    selectedCompany: Yup.string()
        .required(Resources['ComapnyNameRequired'][currentLanguage])
        .nullable(true),
    selectedContact: Yup.string()
        .required(Resources['selectContact'][currentLanguage])
        .nullable(true),
});
const projectSchema = Yup.object().shape({
    selectedProject: Yup.string()
        .required(Resources['projectRequired'][currentLanguage])
        .nullable(true),
});
class allocationOfUsersOnProjects extends Component {

    constructor(props) {
        super(props)
        this.projectColumns = [
            {
                field: 'projectName',
                title: Resources['projectName'][currentLanguage],
                width: 30,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            }, {
                field: 'referenceCode',
                title: Resources['referenceCode'][currentLanguage],
                width: 30,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            }];
        this.companyColumns = [
            {
                field: 'contactName',
                title: Resources['ContactName'][currentLanguage],
                width: 30,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            }, {
                field: 'companyName',
                title: Resources['CompanyName'][currentLanguage],
                width: 30,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }];

        this.state = {
            isLoading: false,
            showGrid: false,
            companyList: [],
            projectList: [],
            current: 0,
            currentColumns: this.projectColumns,
            selectedCompany: { label: Resources.ComapnyNameRequired[currentLanguage], value: "0" },
            selectedProject: { label: Resources.projectRequired[currentLanguage], value: "0" },
            selectedContact: { label: Resources.selectContact[currentLanguage], value: "0" },
            rows: [],
            status: true,
            pageSize: 200,
        }

        if (!Config.IsAllow(3683)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

        this.fields = [[{
            title: Resources["CompanyName"][currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources["ContactName"][currentLanguage],
            value: "",
            type: "text"
        },], [{
            title: Resources["projectName"][currentLanguage],
            value: "",
            type: "text"
        }]];

    }


    componentDidMount() {
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
            Api.get('GetAccountsProjectsById?accountId=' + this.state.selectedContact.value).then((res) => {
                this.setState({ rows: res, isLoading: false, showGrid: true })
            }).catch(() => {
                this.setState({ isLoading: false })
            })
        } else {
            Api.get('GetAccountsProjectsByProjectIdName?projectId=' + this.state.selectedProject.value).then((res) => {
                this.setState({ rows: res, isLoading: false, showGrid: true })
            }).catch(() => {
                this.setState({ isLoading: false })
            })
        }
    }

    handleChange = (e) => {
        dataservice.GetDataList('GetContactsByCompanyIdForOnlyUsers?companyId=' + e.value, 'contactName', 'accountId').then(result => {
            this.setState({
                contactsList: result,
                selectedContact: { label: Resources.selectContact[currentLanguage], value: "0" }
            });
        }).catch(() => {
            toast.error('somthing wrong')
        })
    }

    render() {
        let currentForm = <Fragment>
            {this.state.current == 0 ?
                <Formik
                    initialValues={{
                        selectedCompany: '',
                        selectedContact: ''
                    }}
                    enableReinitialize={true}
                    validationSchema={companySchema}
                    onSubmit={(values, actions) => {
                        this.getGridRows()
                    }}>
                    {({ errors, touched, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                        <Form onSubmit={handleSubmit} className='proForm reports__proForm datepickerContainer'>
                            <div className="linebylineInput valid-input">
                                <Dropdown title='CompanyName' data={this.state.companyList}
                                    name='selectedCompany'
                                    selectedValue={this.state.selectedCompany}
                                    onChange={setFieldValue}
                                    handleChange={e => {
                                        this.setState({ selectedCompany: e }); this.handleChange(e);
                                        this.fields[0][0].value = e.label
                                    }}
                                    onBlur={setFieldTouched}
                                    error={errors.selectedCompany}
                                    touched={touched.selectedCompany}
                                    value={values.selectedCompany} />
                            </div>
                            <div className="linebylineInput valid-input">
                                <Dropdown title='ContactName' data={this.state.contactsList}
                                    name='selectedContact'
                                    selectedValue={this.state.selectedContact}
                                    onChange={setFieldValue}
                                    handleChange={e => {
                                        this.setState({ selectedContact: e });
                                        this.fields[0][1].value = e.label
                                    }}
                                    onBlur={setFieldTouched}
                                    error={errors.selectedContact}
                                    touched={touched.selectedContact}
                                    value={values.selectedContact} />
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
                        <Form onSubmit={handleSubmit} className='proForm reports__proForm datepickerContainer'>
                            <div className="linebylineInput valid-input">
                                <Dropdown title='projectName' data={this.state.projectList}
                                    name='selectedProject'
                                    selectedValue={this.state.selectedProject}
                                    onChange={setFieldValue}
                                    handleChange={e => {
                                        this.setState({ selectedProject: e });
                                        this.fields[1][0].value = e.label
                                    }}
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
            <GridCustom
                ref='custom-data-grid'
                gridKey="allocationOfUsersOnProjects"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.state.currentColumns}
                rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = <ExportDetails fieldsItems={this.state.currentColumns}
            rows={this.state.rows} fields={this.state.current === 0 ? this.fields[0] : this.fields[1]} fileName={Resources.userAllocationOnProjects[currentLanguage]} />


        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.userAllocationOnProjects[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm datepickerContainer' style={{ marginBottom: '0' }}>
                    <div className="linebylineInput valid-input">
                        <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" name="status" defaultChecked="checked" onChange={e => this.setState({ current: 0, rows: [], currentColumns: this.projectColumns, showGrid: false })} />
                            <label>{Resources['Projects'][currentLanguage]}</label>
                        </div>
                    </div>
                    <div className="linebylineInput valid-input">
                        <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" name="status" onChange={e => this.setState({ current: 1, rows: [], currentColumns: this.companyColumns, showGrid: false })} />
                            <label>{Resources['Companies'][currentLanguage]}</label>
                        </div>
                    </div>
                </div>
                {currentForm}
                {this.state.showGrid == true ?
                    <div className="doc-pre-cycle letterFullWidth">
                        {dataGrid}
                    </div> : null}
            </div>
        )
    }
}


export default allocationOfUsersOnProjects
