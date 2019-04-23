import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import moment from "moment";
import Dataservice from '../../../Dataservice';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Api from '../../../api.js';
import HeaderDocument from '../../../Componants/OptionsPanels/HeaderDocument'
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')
const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};
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
        }

        if (!Config.IsAllow(3696)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }

        this.columns = [
            {
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "contractName",
                name: Resources["contracts"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "subject",
                name: Resources["subject"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "totalExcuted",
                name: Resources["totalExcuted"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "originalContractSum",
                name: Resources["originalContractSum"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "variance",
                name: Resources["totalVariance"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "docDate",
                name: Resources["docDate"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            }
        ];

    }

    componentWillMount() {
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
            <GridSetup rows={this.state.rows} showCheckbox={false}
                pageSize={this.state.pageSize} columns={this.columns} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'paymentRequisition'} />
            : null

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
                        <Form onSubmit={handleSubmit} className='proForm reports__proForm'>

                            <div className="linebylineInput multiChoice">
                                <Dropdown title='Projects' data={this.state.ProjectsData}
                                    name='selectedProject'
                                    selectedValue={this.state.selectedProject}
                                    onChange={setFieldValue}
                                    handleChange={e => this.HandleChangeProject(e)}
                                    onBlur={setFieldTouched}
                                    error={errors.selectedProject}
                                    touched={touched.selectedProject}
                                    value={values.selectedProject}
                                    isMulti={true} />
                            </div>
                            <div className="linebylineInput multiChoice" >
                                <Dropdown title='siteRequest' data={this.state.contractorsData} name='selectContractor'
                                    selectedValue={this.state.selectContractor} onChange={setFieldValue}
                                    handleChange={e => this.HandleChangeContractor(e)}
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
