import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous';
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import ExportDetails from "../ExportReportCenterDetails";
import Dataservice from '../../../Dataservice';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Api from '../../../api.js';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')

const ValidtionSchema = Yup.object().shape({
    selectedProject: Yup.string()
        .required(Resources['projectSelection'][currentLanguage])
        .nullable(true),
    selectContractor: Yup.string()
        .required(Resources['siteRequestSelection'][currentLanguage])
        .nullable(true),
});

class paymentRequisition extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            ProjectsData: [],
            projectIds: [],
            contractorsData: [],
            contractors: [],
            selectedProject: { label: Resources.projectSelection[currentLanguage], value: "0" },
            selectContractor: { label: Resources.siteRequestSelection[currentLanguage], value: "0" },
            rows: [],
            pageSize: 200,
        }

        if (!Config.IsAllow(3696)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }

        this.columns = [
            {
                field: "projectName",
                title: Resources["projectName"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: "contractName",
                title: Resources["contracts"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "subject",
                title: Resources["subject"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "docDate",
                title: Resources["docDate"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }, {
                field: "totalExcuted",
                title: Resources["totalExcuted"][currentLanguage],
                width: 9,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "originalContractSum",
                title: Resources["originalContractSum"][currentLanguage],
                width: 9,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "variance",
                title: Resources["totalVariance"][currentLanguage],
                width: 9,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }
        ];

        this.fields = [{
            title: Resources["Projects"][currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources["siteRequest"][currentLanguage],
            value: "",
            type: "text"
        }];
    }

    componentDidMount() {
        Dataservice.GetDataList('ProjectProjectsForList', 'projectName', 'id').then(
            result => {
                this.setState({
                    ProjectsData: result
                })
            }).catch(() => {
                toast.error('somthing wrong')
            })
    }

    getGridRows = () => {
        this.setState({ isLoading: true })
        let paymentObj = { projectIds: this.state.projectIds, contractors: this.state.contractors }
        Api.post('GetPaymentContractors', paymentObj).then(
            res => {
                this.setState({
                    rows: res,
                    isLoading: false
                })
            }
        ).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    HandleChangeProject = (e) => {
        let projectIds = []
        e.forEach(project => {
            projectIds.push(project.value)
        })
        this.setState({ projectIds })
        Api.post('GetProjectCompanyForList', { projectIds: projectIds }).then(
            res => {
                let contractors = []
                res.forEach(item => {
                    contractors.push({ label: item.companyName, value: item.companyId })
                })
                this.setState({ contractorsData: contractors })
            }).catch((e) => {
                toast.error('somthing wrong')
            })
    }

    HandleChangeContractor(e) {
        let contractors = []
        e.forEach(contractor => {
            contractors.push(contractor.value)
        })
        this.setState({ contractors })
    }

    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridCustom
                ref='custom-data-grid'
                key="paymentRequisition"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : <LoadingSection />
        const btnExport = <ExportDetails fieldsItems={this.columns}
            rows={this.state.rows} fields={this.fields} fileName={Resources.paymentRequisition[currentLanguage]} />

        return (
            <div className="reports__content reports__multiDrop">
                <header>
                    <h2 className="zero">{Resources.paymentRequisition[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <Formik
                    initialValues={{
                        selectedProject: '',
                        selectContractor: ''
                    }}
                    enableReinitialize={true}
                    validationSchema={ValidtionSchema}
                    onSubmit={(values, actions) => {
                        this.getGridRows()
                    }}>
                    {({ errors, touched, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                        <Form onSubmit={handleSubmit} className='proForm reports__proForm datepickerContainer'>
                            <div className="linebylineInput multiChoice">
                                <Dropdown title='Projects' data={this.state.ProjectsData}
                                    name='selectedProject'
                                    selectedValue={this.state.selectedProject}
                                    onChange={setFieldValue}
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
                                    value={values.selectedProject}
                                    isMulti={true} />
                            </div>
                            <div className="linebylineInput multiChoice" >
                                <Dropdown title='CompanyName'
                                    data={this.state.contractorsData} name='selectContractor'
                                    selectedValue={this.state.selectContractor}
                                    onChange={setFieldValue}
                                    handleChange={e => {
                                        this.HandleChangeContractor(e);
                                        let documentText = '';
                                        e.map(lable => {
                                            return documentText = lable.label + " - " + documentText
                                        });
                                        this.fields[1].value = documentText
                                    }}
                                    onBlur={setFieldTouched}
                                    error={errors.selectContractor}
                                    touched={touched.selectContractor}
                                    value={values.selectContractor}
                                    isMulti={true} />
                            </div>
                            <div className="btn__multi">
                                <button className="primaryBtn-1 btn smallBtn" type='submit'>{Resources['search'][currentLanguage]}</button>
                            </div>
                        </Form>
                    )}
                </Formik>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

}
export default withRouter(paymentRequisition)
