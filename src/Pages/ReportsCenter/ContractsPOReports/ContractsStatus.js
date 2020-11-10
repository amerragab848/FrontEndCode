import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous';
import Dataservice from '../../../Dataservice';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import GridCustom from 'react-customized-grid';
import ExportDetails from "../ExportReportCenterDetails"; 

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')

const ValidtionSchema = Yup.object().shape({
    selectedProject: Yup.string().required(Resources['projectSelection'][currentLanguage]).nullable(true)
});

class ContractsStatus extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            ProjectsData: [],
            contractorData: [],
            selectedProject: { label: Resources.projectSelection[currentLanguage], value: "0" },
            selectedContractor: { label: Resources.contractorName[currentLanguage], value: "0" },
            rows: []
        }

        if (!Config.IsAllow(4028)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push("/");
        }

        this.columns = [
            {
                "field": "subject",
                "title": Resources.subject[currentLanguage],
                "type": "text",
                "width": 20,
                "groupable": true,
                "fixed": true,
                "sortable": true
            }, {
                "field": "originalContractSum",
                "title": Resources.originalContractSum[currentLanguage],
                "type": "text",
                "width": 18,
                "groupable": true,
                "sortable": true
            }, {
                "field": "variationSum",
                "title": Resources.variationSum[currentLanguage],
                "type": "text",
                "width": 18,
                "groupable": true,
                "sortable": true
            }, {
                "field": "amendmentSum",
                "title": Resources.amendmentsSum[currentLanguage],
                "type": "text",
                "width": 18,
                "groupable": true,
                "sortable": true
            }, {
                "field": "revisedContractSumToDate",
                "title": Resources.revisedContractSumToDate[currentLanguage],
                "type": "text",
                "width": 18,
                "groupable": true,
                "sortable": true
            }, {
                "field": "contractExcutedToDate",
                "title": Resources.contractExcutedToDate[currentLanguage],
                "type": "text",
                "width": 18,
                "groupable": true,
                "sortable": true
            }, {
                "field": "balance",
                "title": Resources.balance[currentLanguage],
                "type": "text",
                "width": 18,
                "groupable": true,
                "sortable": true
            }
        ];

        this.fields = [{
            title: Resources["Projects"][currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources["contractor"][currentLanguage],
            value: "",
            type: "text"
        }];
    }

    componentDidMount() {
        Dataservice.GetDataList('ProjectProjectsGetAll', 'projectName', 'projectId').then(result => {
            result.unshift({ 'label': 'All Projects', 'value': '0' });
            this.setState({
                ProjectsData: result
            })
        }).catch(() => {
            toast.error('somthing wrong')
        })

        Dataservice.GetDataList('SelectAllCompany', 'companyName', 'id').then(result => {
            result.unshift({ 'label': 'All Contractor', 'value': '0' });
            this.setState({
                contractorData: result
            })
        }).catch(() => {
            toast.error('somthing wrong')
        })
    }

    getGridRows = () => {
        this.setState({ isLoading: true })
        Dataservice.GetDataGrid('GetContractsStatus?projectId=' + this.state.selectedProject.value + "contractorId=" + this.state.selectedContractor.value).then(res => {
            this.setState({
                rows: res,
                isLoading: false
            })
        }).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    render() {

        const btnExport = this.state.isLoading === false ?
            (
            <ExportDetails fieldsItems={this.columns}
                rows={this.state.rows}
                 fields={this.fields} fileName={Resources.contractStatus[currentLanguage]} />
            ) : null;

        return (
            <React.Fragment>
                <div className="reports__content">
                    <header>
                        <h2 className="zero">{Resources.contractStatus[currentLanguage]}</h2>
                        {btnExport}
                    </header>
                    <Formik
                        initialValues={{
                            selectedProject: '',
                        }}
                        enableReinitialize={true}
                        validationSchema={ValidtionSchema}
                        onSubmit={(values, actions) => {
                            this.getGridRows()
                        }}>
                        {({ errors, touched, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                            <Form className='proForm reports__proForm datepickerContainer'onSubmit={handleSubmit}>
                                <div className="linebylineInput valid-input">
                                    <Dropdown title='Projects' data={this.state.ProjectsData} name='selectedProject'
                                        selectedValue={this.state.selectedProject} onChange={setFieldValue}
                                        handleChange={e => { this.setState({ selectedProject: e }); this.fields[0].value = e.label }}
                                        onBlur={setFieldTouched}
                                        error={errors.selectedProject}
                                        touched={touched.selectedProject}
                                        value={values.selectedProject} />
                                </div>
                                <div className="linebylineInput valid-input">
                                    <Dropdown title='contractor' data={this.state.contractorData} name='selectedContractor'
                                        selectedValue={this.state.selectedContractor} onChange={setFieldValue}
                                        handleChange={e => { this.setState({ selectedContractor: e }); this.fields[1].value = e.label }}
                                        onBlur={setFieldTouched}
                                        error={errors.selectedContractor}
                                        touched={touched.selectedContractor}
                                        value={values.selectedContractor} />
                                </div>
                                <button className="primaryBtn-1 btn smallBtn" type='submit'>{Resources['search'][currentLanguage]}</button>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {this.state.rows ?
                        (this.state.isLoading ? <LoadingSection /> :
                            <GridCustom ref='custom-data-grid' groups={[]} data={this.state.rows || []} cells={this.columns}
                                pageSize={this.state.rows.length} actions={[]} rowActions={[]} rowClick={() => { }}
                            />)
                        : null}
                </div>
            </React.Fragment>
        )
    }
}
export default withRouter(ContractsStatus)
